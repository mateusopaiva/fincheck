import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountsRepository } from './repositories/bank-accounts.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
  ],
  exports: [UsersRepository, CategoriesRepository, BankAccountsRepository],
})
export class DatabaseModule {}
