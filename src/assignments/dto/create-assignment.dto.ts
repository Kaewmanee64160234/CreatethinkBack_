import { IsNotEmpty } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  date: Date;
}
