import {Module} from '@nestjs/common';
import {TokenStorageService} from './token-storage.service';
import {ConfigModule} from '../../config'
import {HyperLogger} from '../../_common/logger';

@Module({
  providers: [TokenStorageService, HyperLogger, ConfigModule],
  exports: [TokenStorageService]
})
export class TokenStorageModule {}