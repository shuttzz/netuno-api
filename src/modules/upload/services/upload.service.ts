import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsException } from '../../../shared/exceptions/aws.exception';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(fileRequest: Express.Multer.File, folder: string) {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: `${this.configService.get('AWS_BUCKET')}/${folder}`,
          Body: fileRequest.buffer,
          Key: `${uuid()}-${fileRequest.originalname}`,
          ACL: 'public-read',
        })
        .promise();

      return {
        publicUrl: uploadResult.Location,
        key: uploadResult.Key,
      };
    } catch (err) {
      console.log('ERRO AO FAZER UPLOAD', err);
      throw new AwsException('Houve um erro ao fazer o upload do arquivo');
    }
  }

  async deleteFile(file: { publicUrl: string; key: string }): Promise<void> {
    try {
      const s3 = new S3();
      await s3
        .deleteObject({
          Bucket: `${this.configService.get('AWS_BUCKET')}`,
          Key: file.key,
        })
        .promise();
    } catch (err) {
      console.log('ERRO AO EXCLUIR ARQUIVO', err);
      throw new AwsException('Houve um erro ao excluir o arquivo do S3');
    }
  }
}
