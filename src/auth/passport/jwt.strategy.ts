import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {UserSerivce} from '../../user/user.service';
import {TokenStorageService} from '../token-storage/token-storage.service';
import {ConfigService} from '../../config/config.service';
import {Request} from '../../_common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserSerivce,
    private readonly config: ConfigService,
    private readonly tokenRepo: TokenStorageService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(`ACCESS_TOKEN_SECRET`),
      passReqToCallback: true
    });
  }

  public async validate(req: Request, payload: IJwtPayload, done: Function) {
    if (req.headers[`authorization`].split(' ')[1] !== await this.tokenRepo.getAccessToken(payload.userId, payload.sessionKey)) {
      return done(new UnauthorizedException(`Your token has been revoked`), false);
    }

    const user = await this.userService.getById(payload.userId);
    if (!user) {
      return done(new UnauthorizedException(`User not found`), false);
    }

    req.sessionKey = payload.sessionKey;
    done(null, user);
  }
}