import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private service: BookmarksService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    // userId virá do token JWT (em produção)
    return this.service.create(1, dto); // Mock: userId 1
  }

  @Get()
  findAll() {
    return this.service.findAll(1); // Mock: userId 1
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(1, parseInt(id));
  }
}
