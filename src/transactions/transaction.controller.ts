import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
@Controller('transactions') // Move the path here
export class TransactionController {
  constructor(private readonly appService: TransactionService) { }

  @Get('status') // Change from @Get() to avoid conflicts
  getHello(): string {
    return "app is working";
  }

  @Get('filter') // specific path: /transactions/filter?type=deposit
  async getTransactionsByType(@Query('type') type: string) {
    return await this.appService.getTrasactionsByType(type);
  }

   @Get() // specific path: /transactions/filter?type=deposit
  async getTrasactions() {
    return await this.appService.getTrasactions();
  }

  

  @Get('search') // specific path: /transactions/search?name=xyz
  findAll(@Query('name') name: string, @Query('sort') sort: string) {
    return `Filtering by name: ${name} and sorted by: ${sort}`;
  }

  @Get(':id') // path: /transactions/123
  findOne(@Param('id') id: string) {
    return `Returning transaction with ID: ${id}`;
  }

  @Post() // path: POST /transactions
  async postData(@Body() data) {
    console.log("Saving data:", data);
    return await this.appService.saveData(data); // Always 'return' the result
  }
}