import {Module, Logger, Injectable} from '@nestjs/common';

@Injectable()
export class HyperLogger extends Logger {
  public info(context: string, message: string, ...values: Object[] | number[] | boolean[]): void {
    super.log(`${message}: ${JSON.stringify(values)}`, context);
  }

  public err(context: string, message: string, error: any): void {
    super.error(message, error.stack , context);
  }
}

@Module({
  providers: [HyperLogger],
  exports: [HyperLogger]
})
export class LoggerModule {}

