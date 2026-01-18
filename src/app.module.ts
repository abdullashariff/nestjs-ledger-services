import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transactions/transaction.module';

@Module({
  imports: [
    // Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // or 'db' if running inside docker-compose
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'ledger_db',
      autoLoadEntities: true, // This automatically finds your Transaction entity
      synchronize: true,      // Set to false in production!
    }),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}