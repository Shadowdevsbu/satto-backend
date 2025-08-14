import { PrismaService } from "src/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/task.dto";

@Injectable()
export class TaskService{
    constructor(private readonly prisma: PrismaService){}

async createTask(dto: CreateTaskDto, fileUrl, userId){
    return await this.prisma.task.create({
     data: {
        ...dto,
        fileUrl: fileUrl,
        userId: userId
     }
    })
}
}