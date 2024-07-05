import { PickType } from '@nestjs/swagger';
import { CreateLocalUserRequest } from '@common/requests/user';

export class LoginRequest extends PickType(CreateLocalUserRequest, [
  'email',
  'password',
] as const) {}
