import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { Profile } from '../common/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Profile])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
