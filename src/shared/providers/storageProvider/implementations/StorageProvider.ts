import { FileUpload, IStorageProvider } from '../IStorageProvider';
import { S3 } from 'aws-sdk';
import * as process from 'process';

export class StorageProvider implements IStorageProvider {
  private s3Client: S3;
  private s3Bucket: string;

  constructor() {
    this.s3Client = new S3({
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
    });
    this.s3Bucket = process.env.AWS_BUCKET;
  }
  async delete(key: string): Promise<void> {
    await this.s3Client
      .deleteObject({
        Bucket: this.s3Bucket,
        Key: key,
      })
      .promise();
  }

  async upload(folder: string, file: FileUpload): Promise<string> {
    const uploadResult = await this.s3Client
      .upload({
        Bucket: `${this.s3Bucket}/${folder}`,
        Body: file.body,
        Key: file.name,
      })
      .promise();

    return uploadResult.Key;
  }
}
