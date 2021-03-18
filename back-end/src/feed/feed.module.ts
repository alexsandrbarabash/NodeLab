import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';


@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: []
})

export class FeedModule {

}
