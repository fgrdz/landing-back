import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        url: dto.url,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  async remove(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
