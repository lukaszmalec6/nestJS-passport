
import {Injectable, UnauthorizedException, BadRequestException, Inject, NestMiddleware, Next} from '@nestjs/common';
import {verify} from 'jsonwebtoken';
import {IConfig} from '../../config/config.interface';
import {InjectableSymbols} from '../../injectable';
import {Request} from '../../interfaces';
import {User} from '../../user/user.model';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {TokenStorageService} from '../../token-storage/token-storage.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(@Inject(InjectableSymbols.config) private readonly config: IConfig,
  private readonly tokenRepo: TokenStorageService) {}


  resolve = () => async (req: Request, res: Response, next: Function) => {
    const {headers} = req;
    if (!headers['authorization'] || headers['authorization'].split(' ')[0] !== 'Bearer') {
      throw new BadRequestException(`Invalid Authorization header`);
    }
    const refreshToken = headers['authorization'].split(' ')[1]
    if (!refreshToken) {
      throw new BadRequestException(`Refresh token not found`);
    }
    try {
      const payload = verify(refreshToken, this.config.auth.refreshToken.secret) as IJwtPayload;
      if (refreshToken !== await this.tokenRepo.getRefreshToken(payload.userId)) {
        throw new BadRequestException(`Your refresh token has been revoked`);
      }
      req.user = new User();
      req.user.id = payload.userId;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(`Refresh token has expired`);
      }
      throw new UnauthorizedException(error.message);
    }
  }
}