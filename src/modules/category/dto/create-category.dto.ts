import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(5, { message: 'Nome precisa ter ao menos 5 caracteres' })
  @MaxLength(50, { message: 'Nome não pode ter mais que 50 caracteres' })
  name: string;
}
