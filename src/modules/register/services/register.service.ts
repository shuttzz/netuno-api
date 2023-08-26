import { Injectable } from '@nestjs/common';
import {
  PaginationRegisterEntity,
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
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { el, th } from 'date-fns/locale';
import { PrismaService } from '../../database/prisma.service';
import { QueryParamsRegisterDto } from '../dto/query-params-register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private registerRepository: RegisterRepository,
    private uploadService: UploadService,
    private categorySerivce: CategoryService,
    private walleteService: WalletService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async create(
    createRegisterDto: CreateRegisterDto,
    fileRequest: Express.Multer.File,
    userId: string,
  ): Promise<RegisterEntity> {
    let fileUpload = null;

    const wallet = await this.walleteService.findOne(
      createRegisterDto.walletId,
      userId,
    );

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

    if (createRegisterDto.entry) {
      wallet.balance += createRegisterDto.value;
    } else {
      wallet.balance -= createRegisterDto.value;
    }

    await this.walleteService.update(wallet.id, wallet, userId);

    return this.registerRepository.create(createRegisterDto, userId);
  }

  async findAll(
    userId: string,
    queriesParams: QueryParamsRegisterDto,
  ): Promise<PaginationRegisterEntity> {
    return this.registerRepository.findAll(userId, queriesParams);
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

    const wallet = await this.walleteService.findOne(body.walletId, userId);

    if (registerFind.entry) {
      wallet.balance -= registerFind.value;
    } else {
      wallet.balance += registerFind.value;
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

    if (body.entry) {
      wallet.balance += body.value;
    } else {
      wallet.balance -= body.value;
    }

    await this.walleteService.update(wallet.id, wallet, userId);

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

    const wallet = await this.walleteService.findOne(
      registerExists.wallet.id,
      userId,
    );

    if (registerExists.entry) {
      wallet.balance -= registerExists.value;
    } else {
      wallet.balance += registerExists.value;
    }

    await this.walleteService.update(wallet.id, wallet, userId);

    await this.registerRepository.delete(id);
  }

  // @Cron('*/10 * * * * *') // A cada 10 segundos
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // @Cron('0 * * * * *') // A cada minuto
  @Cron(CronExpression.EVERY_DAY_AT_3AM) // Todo dia as 3:00 da manhã
  async schedulleRecurrencyRegister() {
    const recurrenciesRegisters = await this.registerRepository.findRecurrent();

    if (recurrenciesRegisters.length === 0) {
      console.log('NOT FIND REGISTERS WITH RECURRENCY!');
      return;
    }

    const idsToUpdate = [];

    const newRegisters = [];

    recurrenciesRegisters.forEach((register) => {
      idsToUpdate.push(register.id);
      newRegisters.push({
        description: register.description,
        value: register.value,
        dueDate: new Date(),
        entry: register.entry,
        recurrency: true,
        fileUrl: null,
        fileKey: null,
        // @ts-ignore
        categoryId: register.category_id,
        // @ts-ignore
        walletId: register.wallet_id,
        // @ts-ignore
        userId: register.user_id,
      });
    });

    await this.registerRepository.generateRecurrency(newRegisters, idsToUpdate);

    console.log('JOB RECURRENCY DONE');
  }
}
