import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [PrismaService, UsersRepository],
  exports: [UsersRepository],
})
export class DatabaseModule {}
