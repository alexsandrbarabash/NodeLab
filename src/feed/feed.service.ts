import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Post } from '../common/entities/post.entity';
import { deletFile } from '../common/logic/delet.file.helpers';
import { Profile } from '../common/entities/profile.entity';
import { Room } from '../common/entities/room.entity';
import { TypeRoom } from '../room/room.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  getAll(take, skip) {
    return this.postRepository.find({
      order: {
        createAt: 'DESC',
      },
      take,
      skip,
      relations: ['like', 'profile'],
    });
  }

  getById(id: number) {
    return this.postRepository.findOne(id, { relations: ['like'] });
  }

  async create(
    feedDto: CreateFeedDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    if (!file) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }
    const profile = await this.profileRepository.findOne({ userId });

    const comments = this.roomRepository.create({
      id: uuidv4(),
      title: '',
      typeRoom: TypeRoom.COMMENT,
      owner: profile,
    });

    await this.roomRepository.save(comments);

    const post = this.postRepository.create({
      ...feedDto,
      profileId: profile.id,
      photo: file.filename,
      comments,
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
