import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Post } from './entities/post.entity';
import { deletFile } from '../common/logic/delet.file.helpers';
import { LikeDto } from './dto/like.dto';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  getAll(take, skip) {
    return this.postRepository.find({
      order: {
        createAt: 'DESC',
      },
      take,
      skip,
      relations: ['like'],
    });
  }

  getById(id: number) {
    return this.postRepository.findOne(id, { relations: ['like'] });
  }

  create(feedDto: CreateFeedDto, file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }

    const post = this.postRepository.create({
      ...feedDto,
      userId,
      photo: file.filename,
    });
    return this.postRepository.save(post);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
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

  async update(id: number, feedDto: UpdateFeedDto, photo: Express.Multer.File) {
    const post = await this.postRepository.findOne(id);
    let photoObject: { photo?: string };
    if (photo) {
      if (post.photo !== 'default.jpg') {
        const err = await deletFile(
          join(__dirname, '..', '..', 'public', 'feed', post.photo),
        );
        if (err) {
          throw new HttpException(
            'Server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      photoObject = { photo: photo.filename };
    }

    const updateObject = {
      ...feedDto,
      ...photoObject,
    };

    if (
      updateObject &&
      Object.keys(updateObject).length === 0 &&
      updateObject.constructor === Object
    ) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }

    return this.postRepository.update(id, updateObject);
  }
}
