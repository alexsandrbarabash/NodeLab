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
  Req,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedService } from './feed.service';
import ExpandedRequest from '../common/modules/respons.model';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedServise: FeedService) {}

  @Get()
  getAll(@Query() { take, skip }) {
    return this.feedServise.getAll(take, skip);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.feedServise.getById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() createFeedDto: CreateFeedDto,
    @Req() { userId }: ExpandedRequest,
  ) {
    return this.feedServise.create(createFeedDto, file, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.feedServise.remove(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() updateFeedDto: UpdateFeedDto,
    @Param('id') id: number,
  ) {
    return this.feedServise.update(id, updateFeedDto, file);
  }
}
