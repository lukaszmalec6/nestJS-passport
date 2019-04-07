import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {authenticate} from 'passport';
import {LocalStrategy} from './passport/local.strategy';
import {JwtStrategy} from './passport/jwt.strategy';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {User} from '../user/user.model';
import {UserSerivce} from '../user/user.service';
import {InjectableSymbols} from '../injectable';
import {bodyValidator} from '../middlewares/body-validator.middleware';
import {registerSchema} from './validators/register.schema';
import {loginSchema} from './validators/login.schema';
import {JWTStrategySymbols} from './passport/jwt.strategy.symbols';
import {configProvider} from '../config/config.module';
import {RefreshTokenMiddleware} from './middlewares.ts/refresh-token.middleware';
import {TokenStorageModule} from '../token-storage/token-storage';

@Module({
  imports: [
    TokenStorageModule
  ],
  providers: [
    configProvider,
    UserSerivce,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: InjectableSymbols.userRepository,
      useValue: User,
    }
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
