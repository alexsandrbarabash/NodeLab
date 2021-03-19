import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import { UpdateProfileDto } from './dto/update.profile.dto';
import ExpandedRequest from '../common/modules/respons.model';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() { userId }: ExpandedRequest): Promise<Profile> {
    return this.profileService.getProfile(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() { userId }: ExpandedRequest,
  ): Promise<Profile> {
    return this.profileService.createProfile(userId, file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put()
  update(
    @Req() { userId }: ExpandedRequest,
    @UploadedFile()
    file: Express.Multer.File,
    @Body()
    updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateResult> {
    return this.profileService.updateProfile(userId, file, updateProfileDto);
  }
}
