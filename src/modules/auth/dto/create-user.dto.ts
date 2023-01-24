import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  id?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(5, { message: 'Name must be at least 5 characters long' })
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name: string;

  @IsNotEmpty({ message: 'E-mail is required' })
  @MaxLength(150, { message: 'Email cannot be longer than 150 characters' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ValidateIf((object) => object.password !== null)
  @IsNotEmpty({ message: 'Password confirmation is required' })
  passwordConfirmation: string;

  avatarUrl: string;

  avatarKey: string;

  active: boolean;

  firebaseToken: string;
}
