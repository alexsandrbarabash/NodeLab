import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.89.218.42',
      port: 5432,
      username: 'cfif',
      password: 'cfif',
      database: 'cfif',
      autoLoadEntities: true,
      synchronize: true, // delet in product
    }),
  ],
})
export class AppModule {}
