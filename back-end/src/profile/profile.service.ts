import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update.profile.dto';
import { User } from '../common/entities/user.entity';
import * as fs from 'fs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getProfile(userId: number) {
    return this.profileRepository.findOne({ user: userId });
  }

  async createProfile(userId: number) {
    const user = await this.userRepository.findOne(userId);
    const profile = this.profileRepository.create({
      name: user.email,
      user: userId,
    });

    return this.profileRepository.save(profile);
  }

  async updateProfile(
    userId: number,
    photo: Express.Multer.File,
    updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profileRepository.findOne({ user: userId });
    let photoObject: { photo?: string };
    if (photo) {
      if (profile.photo !== 'default.jpg')
        fs.unlink(`./public/avatars/${profile.photo}`, (err) => {
          if (err) {

            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        });
      photoObject = { photo: photo.filename };
    }

    const updateObject = {
      ...updateProfileDto,
      ...photoObject,
    };

    if (
      updateObject &&
      Object.keys(updateObject).length === 0 &&
      updateObject.constructor === Object
    ) {
      throw new HttpException('Incorrect data', HttpStatus.NOT_ACCEPTABLE);
    }

    return this.profileRepository.update({ user: userId }, updateObject);
  }
}
