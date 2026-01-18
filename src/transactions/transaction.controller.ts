import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly appService: TransactionService) { }

  @Get()
  getHello(): string {
    return "app is working";
  }


   @Get()
  async getTrasactionsByType(transactionType: string) {
     await this.appService.getTrasactionsByType(transactionType);
  }

  // this will not override, and request always come on above function
  @Get()
  findAll(@Query('name') name: string, @Query('sort') sort: string) {
    return `This action returns users filtered by name: ${name} and sorted by: ${sort}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a transaction with ID: ${id}`;
  }

  @Post()
  postData(data) {
    console.log("data", data)
    this.appService.saveData(data);
  }

}
