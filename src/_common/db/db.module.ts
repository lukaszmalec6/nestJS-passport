import {Module} from '@nestjs/common';
import {Sequelize} from 'sequelize-typescript';
import {User} from '../../user/user.model';
import {HyperLogger, LoggerModule} from '../logger';
import {InjectableSymbols} from '../../injectable';
import {ConfigModule, ConfigService} from '../../config/';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [{
    provide: InjectableSymbols.db,
    inject: [ConfigService, HyperLogger],
    useFactory: async (config: ConfigService, logger: HyperLogger) => {
      const sequelize = new Sequelize({
        logging: (message) => logger.log(message, `Database`),
        operatorsAliases: false,
        dialect: 'postgres',
        host: config.get(`POSTGRES_HOST`),
        port: config.get(`POSTGRES_PORT`),
        username: config.get(`POSTGRES_USER`),
        password: config.get(`POSTGRES_PASS`),
        database: config.get(`POSTGRES_DATABASE`),
      } as any);
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    }
  }],
  exports: [InjectableSymbols.db]
})
export class DBModule {}