import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {ConfigModule} from './config/config.module';
@Module({
  imports: [
    ConfigModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController]
})
export class AppModule {}
