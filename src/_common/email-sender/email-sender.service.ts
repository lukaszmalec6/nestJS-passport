import {Injectable} from '@nestjs/common';
import {MailerService, ISendMailOptions} from '@nest-modules/mailer';
import {HyperLogger} from '../logger';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: HyperLogger,
  ) {}

  public async sendPostRegisterEmail(emailAddress: string): Promise<void> {
    this.sendEmail({
      to: emailAddress,
      subject: '<post-register-email>',
      text: `
        Welcome to blah blah. To finnish your registration confirm your email address 
        by clicking on the link below.
      `
    });
  }

  private async sendEmail(options: ISendMailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail(options)
      this.logger.info(`Mailer`, `Email sent`, options);
    } catch (error) {
      this.logger.err(`Mailer`, `Error while sendning email ${JSON.stringify(options)}, ${error.message}`, error);
    }
  }
}