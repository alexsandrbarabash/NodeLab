import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  private getMonday() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  async best() {
    const postForWeek = await this.postRepository.find({
      where: { createAt: MoreThan(this.getMonday()) },
      relations: ['like'],
    });
    let bestPost: Post;
    let numberOfLikes = 0;

    postForWeek.forEach((item) => {
      if (item.like.length >= numberOfLikes) {
        bestPost = item;
      }
    });

    return bestPost;
  }
}
