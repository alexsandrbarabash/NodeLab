import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ProfileController } from './profile/profile.controller';
import { FeedController } from './feed/feed.controller';
import { ChatModule } from './chat/chat.module';
import { ConnectModule } from './connect/connect.module';

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
    ChatModule,
    ConnectModule,
  ],
})

// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProfileController, FeedController, {
        path: 'auth/verified-email',
        method: RequestMethod.PUT,
      });
  }
}
