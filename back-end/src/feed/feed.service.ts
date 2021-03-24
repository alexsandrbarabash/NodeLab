import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { Post } from './entities/post.entity';
import { deletFile } from '../common/logic/delet.file.helpers';
import {log} from "util";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  getAll() {
    return this.postRepository.find();
  }

  getById(id: number) {
    return this.postRepository.findOne(id);
  }

  create(feedDto: CreateFeedDto, file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
    console.log(userId);
    const post = this.postRepository.create({
      ...feedDto,
      user: userId,
      photo: file.filename,
    });
    return this.postRepository.save(post);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
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
