import {Module, Provider} from '@nestjs/common';
import {config} from './config';
import {InjectableSymbols} from '../injectable';

export const configProvider: Provider = {
    provide: InjectableSymbols.config,
    useValue: config
  }


@Module({
  providers: [configProvider]
})
export class ConfigModule {}
