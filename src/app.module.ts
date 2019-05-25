import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from './user';
import {AuthModule} from './auth';
import {ConfigModule} from './config';
@Module({
  imports: [
    AuthModule,
    ConfigModule,
    UserModule
  ],
  controllers: [AppController]
})
export class AppModule {}
