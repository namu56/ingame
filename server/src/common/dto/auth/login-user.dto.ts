import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/common/dto/user/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}
