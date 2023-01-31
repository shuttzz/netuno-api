import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InvalidCredentialsException } from '../../../shared/exceptions/invalid-credentials.exception';
import { UserRepository, UserResponse } from '../repositories/user.respository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_AUTH_SECRET,
    });
  }

  async validate(payload: { id: string }): Promise<UserResponse> {
    const { id } = payload;
    const userFind = await this.userRepository.findOne(id);

    if (!userFind) {
      throw new InvalidCredentialsException(
        'Acesso negado, nenhum usuário encontrado com essas informações',
      );
    }

    return userFind;
  }
}
