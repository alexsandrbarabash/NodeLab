import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    ProfileModule,
    FeedModule,
  ],
})
export class AppModule {}
