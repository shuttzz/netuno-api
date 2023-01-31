import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail()
  public email: string;
}
