import { PrismaService } from "src/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService{
    constructor(private readonly prisma: PrismaService){}

async createTask(dto, fileUrl, userId){
    return await this.prisma.create({
        
    })
}
}