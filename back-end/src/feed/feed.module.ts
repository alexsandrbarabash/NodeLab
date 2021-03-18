import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Feed, FeedSchema } from './schemas/feed.chema';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: [MongooseModule.forFeature([
    {name: Feed.name, schema: FeedSchema}
  ])]
})

export class FeedModule {

}
