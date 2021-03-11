import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ormconfig } from '../ormconfig';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(ormconfig), ProfileModule],
})
export class AppModule {}
