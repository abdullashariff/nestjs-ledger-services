import { IsString, IsNumber, IsNotEmpty, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(['deposit', 'withdrawal', 'transfer'])
  type: string;

  @IsString()
  description: string;
}