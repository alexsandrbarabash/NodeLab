import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedService } from './feed.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedServise: FeedService) {}

  @Get()
  getAll(): string {
    return this.feedServise.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): string {
    return this.feedServise.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() createFeedDto: CreateFeedDto,
  ): string {
    return this.feedServise.create(createFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.feedServise.remove(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() updateFeedDto: UpdateFeedDto,
    @Param('id') id: string,
  ): string {
    return this.feedServise.update(id, updateFeedDto);
  }
}
