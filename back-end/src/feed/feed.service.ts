import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    protected postRepository: Repository<Post>,
  ) {}

  getAll(): string {
    return 'Ok';
  }

  getById(id: string): string {
    return 'Ok';
  }

  create(feedDto: CreateFeedDto): string {
    return 'Ok';
  }

  remove(id: string): string {
    return 'Ok';
  }

  update(id: string, feedDto: UpdateFeedDto): string {
    return 'Ok';
  }
}