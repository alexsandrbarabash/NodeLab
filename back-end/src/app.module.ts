import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ormconfig } from '../ormconfig';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(ormconfig)],
})
export class AppModule {}
