import {Module} from '@nestjs/common';
import {config} from './config';
import {InjectableSymbols} from '../injectable';


@Module({
  providers: [
    {
      provide: InjectableSymbols.config,
      useValue: config
    }
  ]
})
export class ConfigModule {}
