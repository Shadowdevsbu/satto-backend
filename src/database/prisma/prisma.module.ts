// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common'; // Import Global decorator
import { PrismaService } from './prisma.service';

@Global() // <--- Add this decorator here
@Module({
  providers: [PrismaService], // PrismaService is provided within this module
  exports: [PrismaService],   // PrismaService is exported so other modules can inject it
})
export class PrismaModule {}