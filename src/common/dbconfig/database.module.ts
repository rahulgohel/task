import { Module } from '@nestjs/common';
import { databaseProviders, entityProviders } from './database.provider';

@Module({
  providers: [...databaseProviders, ...entityProviders],
  exports: [...databaseProviders, ...entityProviders],
 })
export class DatabaseModule {}
