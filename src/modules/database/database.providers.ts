import { Connection, createConnection, DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConnectionKey } from '../../shared/constants/keys.constants';

const createDatabaseConnection = (configService: ConfigService): DataSource =>
  new DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
  });

export const databaseProviders = [
  {
    provide: databaseConnectionKey,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<DataSource> =>
      createDatabaseConnection(configService),
    inject: [ConfigService],
  },
];
