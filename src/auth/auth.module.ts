import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {authenticate} from 'passport';
import {LocalStrategy} from './passport/local.strategy';
import {JwtStrategy} from './passport/jwt.strategy';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {bodyValidator} from '../_common/middlewares';
import {registerSchema} from './validators/register.schema';
import {loginSchema} from './validators/login.schema';
import {JWTStrategySymbols} from '../injectable';
import {RefreshTokenMiddleware} from './middlewares/refresh-token.middleware';
import {TokenStorageModule} from './token-storage/token-storage';
import {EmailSenderModule} from '../_common/email-sender';
import {ConfigModule} from '../config';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    TokenStorageModule,
    EmailSenderModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyValidator(registerSchema),
        authenticate(JWTStrategySymbols.register, {session: false})
      ).forRoutes('api/auth/register')
      .apply(
        bodyValidator(loginSchema),
        authenticate(JWTStrategySymbols.login, {session: false})
      ).forRoutes('api/auth/login')
      .apply(
        RefreshTokenMiddleware
      ).forRoutes('api/auth/refresh')
  }
}
