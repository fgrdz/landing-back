import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      throw new Error('Failed to register user');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user || !user.password) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error('Failed to login');
    }
  }

  async validateOrCreateUserByGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          //avatar: googleUser.picture,
          isGoogleAuth: true, // Adicione este campo ao seu modelo Prisma
        },
      });
    }

    // Gera o token JWT
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        //avatar: user.avatar,
      },
    };
  }
}
