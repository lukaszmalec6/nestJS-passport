import {Injectable, Inject} from '@nestjs/common';
import {sign} from 'jsonwebtoken';
import {IToken} from './interfaces/token.interface';
import {User} from '../user/user.model';
import {InjectableSymbols} from '../injectable';
import {IConfig} from '../config/config.interface';

@Injectable()
export class AuthService {

  constructor(
    @Inject(InjectableSymbols.config) private readonly config: IConfig
  ) {}

  public async createToken(user: User): Promise<IToken> {
    return {
      token: sign(
        {userId: user.id},
        this.config.auth.authSecret,
        {expiresIn: this.config.auth.authTokenExpiresIn}
      )
    };
  }
}
