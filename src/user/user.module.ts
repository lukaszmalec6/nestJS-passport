
import {Module} from '@nestjs/common';
import {DBModule} from '../_common/db';
import {UserController} from './user.controller';
import {UserSerivce} from './user.service';
import {User} from './user.model';
import {InjectableSymbols} from '../injectable';


@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [
    UserSerivce,
    {
      provide: InjectableSymbols.userRepository,
      useValue: User,
    }
  ],
  exports: [UserSerivce]
})
export class UserModule {}