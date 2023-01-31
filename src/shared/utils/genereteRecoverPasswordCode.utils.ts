import { hash } from 'bcrypt';

export const genereteRecoverPasswordCode = async (
  emailAndIdUser: string,
): Promise<string> => {
  return hash(emailAndIdUser, 10);
};
