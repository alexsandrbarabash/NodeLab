import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Profile } from '../profile/entities/profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import imgValidator from '../common/logic/img.validator';
import { diskStorage } from 'multer';
import filenameCreator from '../common/logic/filename.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Profile]),
    MulterModule.register({
      fileFilter: imgValidator,
      storage: diskStorage({
        destination: './public/feed',
        filename: filenameCreator,
      }),
    }),
  ],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
