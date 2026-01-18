// src/transactions/transaction.service.ts
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private dataSource: DataSource, // Used for manual transaction control
  ) {}

  /**
   * Performs an atomic transfer between two accounts
   */
  async createTransfer(fromAccountId: string, toAccountId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the Debit Entry (Negative amount)
      const debitEntry = queryRunner.manager.create(Transaction, {
        accountId: fromAccountId,
        amount: -amount,
        description: `Transfer to ${toAccountId}`,
      });

      // 2. Create the Credit Entry (Positive amount)
      const creditEntry = queryRunner.manager.create(Transaction, {
        accountId: toAccountId,
        amount: amount,
        description: `Transfer from ${fromAccountId}`,
      });

      // Save both simultaneously
      await queryRunner.manager.save([debitEntry, creditEntry]);

      // If we reach here, commit the changes to the DB
      await queryRunner.commitTransaction();
      
      return { status: 'success', transactionIds: [debitEntry.id, creditEntry.id] };
    } catch (err) {
      // If anything fails, undo everything
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Transaction failed and was rolled back');
    } finally {
      // Release the connection back to the pool
      await queryRunner.release();
    }
  }

  /**
   * Calculates the current balance for an account
   */
  async getBalance(accountId: string): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .where('t.accountId = :accountId', { accountId })
      .getRawOne();

    return parseFloat(result.sum) || 0;
  }

  async getTrasactionsByType(type: string): Promise<Array<Transaction>> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      .where('t.type = :type', { type })
      .getMany();

    return result;
  }

  async getTrasactions(): Promise<Array<Transaction>> {
    const result = await this.transactionRepo
      .createQueryBuilder('t')
      // .where('t.type = :type', { type })
      .getMany();

    return result;
  }

  async saveData(data: Partial<Transaction>): Promise<Transaction> {
    // 1. Basic Validation logic
    if (data.amount === 0) {
      throw new BadRequestException('Amount must be greater than or less than zero');
    }

    // 2. Create the instance
    const newTransaction = this.transactionRepo.create(data);

    // 3. Persist to Postgres
    return await this.transactionRepo.save(newTransaction);
  }
}