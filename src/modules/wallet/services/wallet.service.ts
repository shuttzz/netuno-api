import { Injectable } from '@nestjs/common';
import { ExistingEntityException } from '../../../shared/exceptions/existing-entity.exception';
import { EntityNotFoundException } from '../../../shared/exceptions/entity-not-found.exception';
import {
  WalletEntity,
  WalletRepository,
} from '../repositories/wallet.repository';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private repository: WalletRepository) {}

  async create(body: CreateWalletDto, userId: string): Promise<WalletEntity> {
    const walletExists = await this.repository.findByName(body.name, userId);

    if (walletExists) {
      throw new ExistingEntityException('Já existe uma carteira com esse nome');
    }

    return this.repository.create(body, userId);
  }

  async findAll(userId: string): Promise<WalletEntity[]> {
    return this.repository.findAll(userId);
  }

  async findOne(id: string, userId: any): Promise<WalletEntity> {
    const walletFind = await this.repository.findOne(id, userId);

    if (!walletFind) {
      throw new EntityNotFoundException('Carteira não encontrada');
    }

    return walletFind;
  }

  async update(
    id: string,
    body: UpdateWalletDto,
    userId: string,
  ): Promise<void> {
    const walletFind = await this.repository.findOne(id, userId);

    if (!walletFind) {
      throw new EntityNotFoundException('Carteira não existe');
    }

    const walletExists = await this.repository.findByName(body.name, userId);

    if (walletExists !== null && walletExists.id !== id) {
      throw new ExistingEntityException('Já existe uma carteira com esse nome');
    }

    await this.repository.update(id, body);
  }

  async delete(id: string, userId: string): Promise<void> {
    const walletExists = await this.repository.findOne(id, userId);

    if (!walletExists) {
      throw new EntityNotFoundException('Carteira não encontrada');
    }

    await this.repository.delete(id);
  }
}
