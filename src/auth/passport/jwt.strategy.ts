import {Injectable, UnauthorizedException, Inject} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {IJwtPayload} from '../interfaces/jwt-payload.interface';
import {User} from '../../user/user.model';
import {InjectableSymbols} from '../../injectable';
import {IConfig} from '../../config/config.interface';
import {UserSerivce} from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly userService: UserSerivce,
    @Inject(InjectableSymbols.config) private readonly config: IConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.authSecret
    });
  }

  public async validate(payload: IJwtPayload, done: Function) {
    const user: User = await this.userService.getById(payload.userId);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}