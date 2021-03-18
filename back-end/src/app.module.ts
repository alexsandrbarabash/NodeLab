import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    ProfileModule,
    FeedModule,
    MongooseModule.forRoot(`mongodb+srv://Artur:Artur-228@cluster0.iy8ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
  ],
})
export class AppModule {}
