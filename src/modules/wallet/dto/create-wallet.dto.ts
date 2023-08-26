import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome precisa ter ao menos 3 caracteres' })
  @MaxLength(50, { message: 'Nome não pode ter mais que 50 caracteres' })
  name: string;

  balance: number;
}
