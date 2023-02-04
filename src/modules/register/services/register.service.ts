import { Injectable } from '@nestjs/common';
import {
  RegisterEntity,
  RegisterRepository,
} from '../repositoires/register.repository';
import { UploadService } from '../../upload/services/upload.service';
import { ConfigService } from '@nestjs/config';
import { CreateRegisterDto } from '../dto/create-register.dto';
import { CategoryService } from '../../category/services/category.service';
import { WalletService } from '../../wallet/services/wallet.service';
import { EntityNotFoundException } from '../../../shared/exceptions/entity-not-found.exception';
import { UpdateRegisterDto } from '../dto/update-register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private registerRepository: RegisterRepository,
    private uploadService: UploadService,
    private categorySerivce: CategoryService,
    private walleteService: WalletService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createRegisterDto: CreateRegisterDto,
    fileRequest: Express.Multer.File,
    userId: string,
  ): Promise<RegisterEntity> {
    let fileUpload = null;

    await this.walleteService.findOne(createRegisterDto.walletId, userId);

    await this.categorySerivce.findOne(createRegisterDto.categoryId, userId);

    if (fileRequest) {
      fileUpload = await this.uploadService.uploadFile(
        fileRequest,
        this.configService.get('AWS_REGISTERS_FOLDER'),
      );

      createRegisterDto.fileUrl = fileUpload.publicUrl;
      createRegisterDto.fileKey = fileUpload.key;
    }

    createRegisterDto.value = Number(createRegisterDto.value);
    createRegisterDto.dueDate = new Date(createRegisterDto.dueDate);
    //@ts-ignore
    createRegisterDto.recurrency = createRegisterDto.recurrency === 'true';
    //@ts-ignore
    createRegisterDto.entry = createRegisterDto.entry === 'true';

    return this.registerRepository.create(createRegisterDto, userId);
  }

  async findAll(userId: string): Promise<RegisterEntity[]> {
    return this.registerRepository.findAll(userId);
  }

  async findOne(id: string, userId: string): Promise<RegisterEntity> {
    const registerFind = await this.registerRepository.findOne(id, userId);

    if (!registerFind) {
      throw new EntityNotFoundException('Registro não encontrado');
    }

    return registerFind;
  }

  async update(
    id: string,
    body: UpdateRegisterDto,
    userId: string,
    fileRequest: Express.Multer.File,
  ) {
    const registerFind = await this.registerRepository.findOne(id, userId);

    if (!registerFind) {
      throw new EntityNotFoundException('Registro não encontrado');
    }

    if (fileRequest) {
      if (registerFind.fileUrl) {
        await this.uploadService.deleteFile({
          publicUrl: registerFind.fileUrl,
          key: registerFind.fileKey,
        });
      }

      const fileUploaded = await this.uploadService.uploadFile(
        fileRequest,
        this.configService.get('AWS_REGISTERS_FOLDER'),
      );

      body.fileUrl = fileUploaded.publicUrl;
      body.fileKey = fileUploaded.key;
    } else if (body.keepImage === 'false') {
      if (registerFind.fileUrl) {
        await this.uploadService.deleteFile({
          publicUrl: registerFind.fileUrl,
          key: registerFind.fileKey,
        });
      }

      body.fileUrl = null;
      body.fileKey = null;
    }
    body.value = Number(body.value);
    body.dueDate = new Date(body.dueDate);
    //@ts-ignore
    body.recurrency = body.recurrency === 'true';
    //@ts-ignore
    body.entry = body.entry === 'true';

    await this.registerRepository.update(id, body);
  }

  async delete(id: string, userId: string): Promise<void> {
    const registerExists = await this.findOne(id, userId);

    if (registerExists.fileUrl) {
      await this.uploadService.deleteFile({
        publicUrl: registerExists.fileUrl,
        key: registerExists.fileKey,
      });
    }

    await this.registerRepository.delete(id);
  }
}
