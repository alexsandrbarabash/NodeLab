import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ormconfig } from '../ormconfig';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(ormconfig),
    ProfileModule,
    FeedModule,
  ],
})
export class AppModule {}
