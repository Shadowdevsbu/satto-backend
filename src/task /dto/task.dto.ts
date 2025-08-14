import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  course: string;

  @IsString()
  description: string;

  @IsDateString()
  deadline: string;

  @IsNumber()
  budget: number;
}
