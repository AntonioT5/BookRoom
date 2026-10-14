import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BookSlotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  purpose: string;
}