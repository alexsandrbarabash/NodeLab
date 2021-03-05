import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ormconfig } from '../ormconfig';

/*
* {
      type: 'postgres',
      host: '34.89.218.42',
      port: 5432,
      username: 'cfif',
      password: 'cfif',
      database: 'cfif',
      autoLoadEntities: true,
      synchronize: true,
    }*/

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(ormconfig)],
})
export class AppModule {}
