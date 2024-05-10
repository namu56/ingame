import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/apis/users/dto/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}
