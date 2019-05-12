import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {use} from 'passport';
import {Strategy} from 'passport-local';
import {createHmac} from 'crypto';
import {UserSerivce} from '../../user/user.service';
import {JWTStrategySymbols} from './jwt.strategy.symbols';
import {Request} from '../../interfaces';
import {EmailSenderService} from '../../email-sender/email-sender.service';
import {ConfigService} from '../../config/config.service';

@Injectable()
export class LocalStrategy {

  private readonly salt: string;

  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserSerivce,
    private readonly mailer: EmailSenderService
  ) {
    this.salt = this.config.get('SALT');
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
        const hash = this.generateHashedPassword(password, this.salt);
        const user = await this.userService.create({firstName, lastName, email, password: hash});
        await this.mailer.sendPostRegisterEmail(email);
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

        const hash = this.generateHashedPassword(password, this.salt);
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
