import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { ProfileController } from './profile/profile.controller';
import { FeedController } from './feed/feed.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
    AuthModule,
    ProfileModule,
    FeedModule,
  ],
})

// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProfileController, FeedController);
  }
}
