import { jwtGuard } from "src/auth/guards/jwt.guards";
import { Controller, Post, UseGuards, UseInterceptors, Req, Body, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TaskService } from "./task.service";
import {diskStorage} from "multer"
import { extname, join } from "path";
import { CreateTaskDto } from "./dto/task.dto";
import { Express } from "express";


@Controller('task')
export class TaskController {
constructor(private readonly taskService: TaskService){}

@UseGuards(jwtGuard)
@Post()
@UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, join(__dirname, '..', '..', 'uploads'));
          },
        filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
    })
}))
async createTask(@Req() req, @Body() dto: CreateTaskDto, @UploadedFile
() file: Express.Multer.File){
const fileUrl = `/uploads/${file.filename}`
const userId  = req.user.userId
return this.taskService.createTask(dto, fileUrl, userId)
}


}