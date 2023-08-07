import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { models } from './models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          dialect: 'postgres',
          host: config.get('dbHost'),
          port: config.get('dbPort'),
          username: config.get('dbUser'),
          password: config.get('dbPassword'),
          database: config.get('dbName'),
          autoLoadModels: true,
          models,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
