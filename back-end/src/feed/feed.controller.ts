import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedService } from './feed.service';

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
  create(@Body() createFeedDto: CreateFeedDto): string {
    return this.feedServise.create(createFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.feedServise.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateFeedDto: UpdateFeedDto,
    @Param('id') id: string,
  ): string {
    return this.feedServise.update(id, updateFeedDto);
  }
}
