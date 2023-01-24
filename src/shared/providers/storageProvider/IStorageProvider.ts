export type FileUpload = {
  body: Buffer;
  name: string;
};

interface IStorageProvider {
  upload(folder: string, file: FileUpload): Promise<string>;

  delete(key: string): Promise<void>;
}

export { IStorageProvider };
