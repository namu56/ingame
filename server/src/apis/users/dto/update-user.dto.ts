import { PickType } from '@nestjs/mapped-types';
import { UserResponseDto } from './user-response.dto';

export class UpdateUserDto extends PickType(UserResponseDto, ['nickname', 'intro'] as const) {}
