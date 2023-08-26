import { Injectable } from '@nestjs/common';
import {
  PaginationRegisterEntity,
  RegisterEntity,
  RegisterRepository,
} from '../register.repository';
import { PrismaService } from '../../../database/prisma.service';
import { CreateRegisterDto } from '../../dto/create-register.dto';
import { UpdateRegisterDto } from '../../dto/update-register.dto';
import { getDate, getMonth } from 'date-fns';
import { Register } from '@prisma/client';
import { QueryParamsRegisterDto } from '../../dto/query-params-register.dto';

@Injectable()
export class PrismaRegisterRepository implements RegisterRepository {
  constructor(private prisma: PrismaService) {}
  async create(
    params: CreateRegisterDto,
    userId: string,
  ): Promise<RegisterEntity> {
    const result = await this.prisma.register.create({
      data: {
        description: params.description,
        value: params.value,
        recurrency: params.recurrency || false,
        entry: params.entry || false,
        dueDate: params.dueDate,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        wallet: {
          connect: {
            id: params.walletId,
          },
        },
        category: {
          connect: {
            id: params.categoryId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    if (result) {
      return {
        ...result,
        value: Number(result.value),
      };
    }

    return null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.register.delete({
      where: {
        id,
      },
    });
  }

  async findAll(
    userId: string,
    queriesParams: QueryParamsRegisterDto,
  ): Promise<PaginationRegisterEntity> {
    const whereClause = this.generateWhereClause(queriesParams, userId);
    const size = queriesParams?.size ? Number(queriesParams?.size) : 25;
    const page = queriesParams?.page ? Number(queriesParams?.page) : 0;
    const sort = queriesParams?.sort || 'dueDate';
    const order = queriesParams?.order || 'desc';
    const totalItems = await this.prisma.register.count({
      where: whereClause,
    });
    // const totalPages = 0;
    const totalPages = Math.ceil(totalItems / size) - 1;
    const currentPage = page;
    const result = await this.prisma.register.findMany({
      where: whereClause,
      take: size,
      skip: page,
      orderBy: {
        [sort]: order,
      },
    });

    const results = result.map((register) => ({
      ...register,
      value: Number(register.value),
    }));

    return {
      results,
      pagination: {
        length: totalItems,
        size,
        lastPage: totalPages,
        page: currentPage,
        startIndex: currentPage * size,
        endIndex: currentPage * size + (size - 1),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<RegisterEntity> {
    const result = await this.prisma.register.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        wallet: true,
        category: true,
      },
    });

    if (result) {
      return {
        ...result,
        value: Number(result.value),
        wallet: {
          ...result.wallet,
          balance: Number(result.wallet.balance),
        },
      };
    }

    return null;
  }

  async findRecurrent(): Promise<RegisterEntity[]> {
    const dateNow = new Date(); // Mês começa em 0 ou seja janeiro é igual a 0
    const dayNow = getDate(dateNow);
    const monthNow = getMonth(dateNow) + 1;

    const results: Register[] = await this.prisma
      .$queryRaw`SELECT * FROM "public"."registers" WHERE EXTRACT('Month' FROM due_date) + 1 = ${monthNow} AND EXTRACT('Day' FROM due_date) = ${dayNow} AND recurrency = true`;

    return results.map((register) => ({
      ...register,
      value: Number(register.value),
    }));
  }

  async update(id: string, params: UpdateRegisterDto): Promise<void> {
    await this.prisma.register.update({
      where: {
        id,
      },
      data: {
        description: params.description,
        value: params.value,
        recurrency: params.recurrency,
        entry: params.entry,
        dueDate: params.dueDate,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        wallet: {
          connect: {
            id: params.walletId,
          },
        },
        category: {
          connect: {
            id: params.categoryId,
          },
        },
      },
    });
  }

  async generateRecurrency(data: CreateRegisterDto[], ids: string[]) {
    const createdPromise = this.prisma.register.createMany({
      // @ts-ignore
      data: Object.values(data),
    });

    const updatedPromise = this.prisma.register.updateMany({
      data: {
        recurrency: false,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });

    await this.prisma.$transaction([createdPromise, updatedPromise]);
  }

  private generateWhereClause(
    queryParams: QueryParamsRegisterDto,
    userId: string,
  ) {
    const objectWhere = {
      user: {
        id: userId,
      },
    };

    if (queryParams?.searchDescription) {
      objectWhere['description'] = {
        contains: queryParams?.searchDescription,
        mode: 'insensitive',
      };
    }

    if (queryParams?.searchValue) {
      objectWhere['value'] = Number(queryParams?.searchValue);
    }

    if (queryParams?.searchDueDate) {
      objectWhere['dueDate'] = {
        gte: new Date(queryParams?.searchDueDate),
        // lte: new Date(queryParams?.searchDueDate),
      };
    }

    if (queryParams?.searchEntry) {
      // @ts-ignore
      const truthValue = queryParams?.searchEntry === 'true';
      objectWhere['entry'] = truthValue;
    }

    if (queryParams?.searchRecurrency) {
      // @ts-ignore
      const truthValue = queryParams?.searchRecurrency === 'true';
      objectWhere['recurrency'] = truthValue;
    }

    if (queryParams?.searchCategory) {
      objectWhere['category'] = { id: queryParams?.searchCategory };
    }

    if (queryParams?.searchWallet) {
      objectWhere['wallet'] = { id: queryParams?.searchWallet };
    }

    return objectWhere;
  }
}
