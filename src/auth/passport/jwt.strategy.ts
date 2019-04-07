import {Injectable, UnauthorizedException, Inject} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {InjectableSymbols} from '../../injectable';
import {IConfig} from '../../config/config.interface';
import {UserSerivce} from '../../user/user.service';
import {TokenStorageService} from '../../token-storage/token-storage.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserSerivce,
    @Inject(InjectableSymbols.config) private readonly config: IConfig,
    private readonly tokenRepo: TokenStorageService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.accessToken.secret,
      passReqToCallback: true
    });
  }

  public async validate(req: Request, payload: IJwtPayload, done: Function) {
    if (req.headers['authorization'].split(' ')[1] !== await this.tokenRepo.getAccessToken(payload.userId)) {
      return done(new UnauthorizedException(`Your token has been revoked`), false);
    }

    const user = await this.userService.getById(payload.userId);
    if (!user) {
      return done(new UnauthorizedException(`User not found`), false);
    }

    done(null, user);
  }
}