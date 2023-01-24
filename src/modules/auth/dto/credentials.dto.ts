import { IsEmail, IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty({ message: 'E-mail is required' })
  @IsEmail()
  public email: string;
  @IsNotEmpty({ message: 'Password is required' })
  public password: string;
  public remember: boolean;
}
