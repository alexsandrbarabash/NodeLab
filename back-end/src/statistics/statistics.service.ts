import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { MoreThan, Repository } from 'typeorm';
import { LikeDto } from './dto/like.dto';
import { Profile } from '../common/entities/profile.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
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
        numberOfLikes = item.like.length;
      }
    });

    return bestPost;
  }

  async like(postId: number, likeDto: LikeDto) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['like'],
    });

    const profile = await this.profileRepository.findOne(likeDto.profileId);
    let update = true;
    post.like.forEach((item) => {
      if (item.id === profile.id) {
        update = false;
      }
    });

    if (update) {
      post.like.push(profile);
    }

    return this.postRepository.save(post);
  }

  async dislike(postId: number, likeDto: LikeDto) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['like'],
    });

    const profile = await this.profileRepository.findOne(likeDto.profileId);

    post.like = post.like.filter((item) => {
      return item.id !== profile.id;
    });

    return this.postRepository.save(post);
  }
}
