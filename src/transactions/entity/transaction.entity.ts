import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number; // Positive for credit, negative for debit

  @Column()
  description: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}