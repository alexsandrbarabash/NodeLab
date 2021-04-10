import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { LikeDto } from './dto/like.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/best')
  best() {
    return this.statisticsService.best();
  }

  @Put('/like/:id')
  like(@Param('id') id: number, @Body() likeDto: LikeDto) {
    return this.statisticsService.like(id, likeDto);
  }

  @Put('/dislike/:id')
  dislike(@Param('id') id: number, @Body() likeDto: LikeDto) {
    return this.statisticsService.dislike(id, likeDto);
  }
}
