import * as path from 'path';

export const resolvePath = (filename: string) => {
  return path.resolve(__dirname, '..', 'views', 'email', filename);
};
