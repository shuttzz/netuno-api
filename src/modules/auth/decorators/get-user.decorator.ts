import { createParamDecorator } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

export const GetUser = createParamDecorator((data, req): { id: string } => {
  const token = req.args[0].headers.authorization.split(' ')[1];
  return jwtDecode<{ id: string }>(token);
});
