
import {Module} from '@nestjs/common';
import {db} from './db.provider';

@Module({
  providers: [...db],
  exports: [...db]
})
export class DBModule {}