import {Injectable, Inject} from '@nestjs/common';
import {sign} from 'jsonwebtoken';
import {IToken} from './interfaces/token.interface';
import {InjectableSymbols} from '../injectable';
import {IConfig} from '../config/config.interface';
import {TokenStorageService} from 'src/token-storage/token-storage.service';

@Injectable()
export class AuthService {

  constructor(
    @Inject(InjectableSymbols.config) private readonly config: IConfig,
    private readonly tokenRepo: TokenStorageService
  ) {}

  public async createToken(userId: string): Promise<IToken> {
    const config = this.config.auth;
    const accessToken = sign({userId}, config.accessToken.secret, {expiresIn: config.accessToken.expiresIn});
    const refreshToken = sign({userId}, config.refreshToken.secret, {expiresIn: config.refreshToken.expiresIn});
    await this.tokenRepo.saveTokens(userId, accessToken, refreshToken);
    return {accessToken, refreshToken};
  }

  public async logout(userId: string): Promise<boolean> {
    try {
      await this.tokenRepo.deleteTokens(userId);
      return true;
    } catch (error) {
      return false;
    }

  }
}
