import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PointService } from './point.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../auth/auth.interface';
import { UpdatePointDto } from './dto/update-point.dto';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('point')
@ApiTags('Point API')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: '포인트 추가 및 감소' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'fail - User not found' })
  @ApiNotFoundResponse({ description: 'fail - Quest not found' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePoint(@CurrentUser() user: JwtPayload, @Body() updatePointDto: UpdatePointDto) {
    await this.pointService.updatePoint(user.id, updatePointDto);
  }
}
