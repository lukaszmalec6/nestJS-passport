
import {Injectable, UnauthorizedException, BadRequestException, Inject, NestMiddleware, Next} from '@nestjs/common';
import {verify} from 'jsonwebtoken';
import {Request} from '../../interfaces';
import {User} from '../../user/user.model';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {TokenStorageService} from '../../token-storage/token-storage.service';
import {ConfigService} from '../../config/config.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {

  private readonly refreshTokenSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly tokenRepo: TokenStorageService
  ) {
    this.refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');
  }


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
      const payload = verify(refreshToken, this.refreshTokenSecret) as IJwtPayload;
      if (refreshToken !== await this.tokenRepo.getRefreshToken(payload.userId)) {
        throw new BadRequestException(`Your refresh token has been revoked`);
      }
      req.user = new User({
        id: payload.userId
      });
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(`Refresh token has expired`);
      }
      throw new UnauthorizedException(error.message);
    }
  }
}