import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MulterModule } from '@nestjs/platform-express';
import imgValidator from '../common/logic/img.validator';
import { diskStorage } from 'multer';
import filenameCreator from '../common/logic/filename.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Profile } from '../common/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    MulterModule.register({
      fileFilter: imgValidator,
      storage: diskStorage({
        destination: './public/avatars',
        filename: filenameCreator,
      }),
    }),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
