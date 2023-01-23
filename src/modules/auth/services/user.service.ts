import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  UserEntity,
  UserRepository,
  UserResponse,
} from '../repository/user.respository';
import { ExistingEntityException } from '../../../shared/exceptions/existing-entity.exception';
import { UploadService } from '../../upload/services/upload.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { InvalidConfirmationPasswordException } from '../../../shared/exceptions/invalid-confirmation-password.exception';
import { EntityNotFoundException } from '../../../shared/exceptions/entity-not-found.exception';
import { InvalidPermissionException } from '../../../shared/exceptions/invalid-permission.exception';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    fileRequest: Express.Multer.File,
  ): Promise<UserResponse> {
    let fileUpload = null;

    const userExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ExistingEntityException(
        'Já existe um usuário cadastrado com esse e-mail',
      );
    }

    if (fileRequest) {
      fileUpload = await this.uploadService.uploadFile(
        fileRequest,
        this.configService.get('AWS_USERS_FOLDER'),
      );

      createUserDto.avatarUrl = fileUpload.avatarUrl;
      createUserDto.avatarKey = fileUpload.avatarKey;
    }

    if (
      createUserDto.password !== undefined &&
      createUserDto.password !== createUserDto.passwordConfirmation
    ) {
      throw new InvalidConfirmationPasswordException('As senhas não conferem');
    } else if (
      createUserDto.password !== undefined &&
      createUserDto.password === createUserDto.passwordConfirmation
    ) {
      createUserDto.password = await hash(createUserDto.password, 8);
    }

    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserResponse> {
    return this.userRepository.findOne(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    fileRequest: Express.Multer.File,
  ) {
    const userExists = await this.userRepository.findByEmail(
      updateUserDto.email,
    );

    if (!userExists) {
      throw new EntityNotFoundException(
        'Não existe um usuário cadastrado com ese e-mail',
      );
    }

    if (userExists.id !== id) {
      throw new InvalidPermissionException(
        'Você não tem permissão para alterar dados de outro usuário',
      );
    }

    if (
      updateUserDto.password !== undefined &&
      updateUserDto.password !== updateUserDto.passwordConfirmation
    ) {
      throw new InvalidConfirmationPasswordException('As senhas não conferem');
    } else if (
      updateUserDto.password !== undefined &&
      updateUserDto.password === updateUserDto.passwordConfirmation
    ) {
      updateUserDto.password = await hash(updateUserDto.password, 8);
    }

    if (fileRequest) {
      if (userExists.avatarUrl) {
        await this.uploadService.deleteFile({
          publicUrl: userExists.avatarUrl,
          key: userExists.avatarKey,
        });
      }

      const fileUploaded = await this.uploadService.uploadFile(
        fileRequest,
        this.configService.get('AWS_USERS_FOLDER'),
      );

      updateUserDto.avatarUrl = fileUploaded.publicUrl;
      updateUserDto.avatarKey = fileUploaded.key;
    } else if (updateUserDto.keepImage === 'false') {
      if (userExists.avatarUrl) {
        await this.uploadService.deleteFile({
          publicUrl: userExists.avatarUrl,
          key: userExists.avatarKey,
        });
      }
      updateUserDto.avatarUrl = null;
      updateUserDto.avatarKey = null;
    }

    await this.userRepository.update({
      id: userExists.id,
      avatarUrl: updateUserDto.avatarUrl,
      avatarKey: updateUserDto.avatarKey,
      active: updateUserDto.active || userExists.active,
      firebaseToken: updateUserDto.firebaseToken || userExists.firebaseToken,
      password: updateUserDto.password || userExists.password,
      email: updateUserDto.email,
      name: updateUserDto.name,
    });
  }

  async remove(id: string): Promise<void> {
    const userExists = await this.userRepository.findOne(id);

    if (!userExists) {
      throw new EntityNotFoundException(
        'Não existe um usuário cadastrado com ese e-mail',
      );
    }

    await this.userRepository.delete(id);
  }
}