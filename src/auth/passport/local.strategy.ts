import {Injectable, UnauthorizedException, Inject, BadRequestException} from '@nestjs/common';
import {use} from 'passport';
import {Strategy} from 'passport-local';
import {createHmac} from 'crypto';
import {UserSerivce} from '../../user/user.service';
import {InjectableSymbols} from '../../injectable';
import {IConfig} from '../../config/config.interface';
import {JWTStrategySymbols} from './jwt.strategy.symbols';
import {Request} from '../../interfaces';

@Injectable()
export class LocalStrategy {

  constructor(
    private readonly userService: UserSerivce,
    @Inject(InjectableSymbols.config) private readonly config: IConfig
  ) {
    this.init();
  }

  private generateHashedPassword(salt: string, password: string): string {
    return createHmac('sha256', salt).update(password).digest('hex');
  };

  private init(): void {
    use(JWTStrategySymbols.register, new Strategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req: Request, email: string, password: string, done: Function) => {
      try {
        if (await this.userService.getByEmail(email)) {
          return done(new BadRequestException(`Email already in use`), false);
        }
        const {firstName, lastName} = req.body;
        const hash = this.generateHashedPassword(password, this.config.auth.salt);
        const user = await this.userService.create({firstName, lastName, email, password: hash});

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }));

    use(JWTStrategySymbols.login, new Strategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email: string, password: string, done: Function) => {
      try {
        const user = await this.userService.getByEmail(email)
        if (!user) {
          return done(new UnauthorizedException(`Email not found`), false);
        }

        const hash = this.generateHashedPassword(password, this.config.auth.salt);
        if (hash !== user.password) {
          return done(new UnauthorizedException(`Wrong password`), false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }));
  }
}
