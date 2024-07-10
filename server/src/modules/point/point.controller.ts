import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccessTokenPayload } from '../auth/auth.interface';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { IPointService, POINT_SERVICE_KEY } from './interfaces/point-service.interface';
import { UpdatePointRequest } from '@common/requests/point';

@Controller('point')
@ApiTags('Point API')
export class PointController {
  constructor(@Inject(POINT_SERVICE_KEY) private readonly pointService: IPointService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: '포인트 추가 및 감소' })
  @ApiBearerAuth('accessToken')
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'fail - User not found' })
  @ApiNotFoundResponse({ description: 'fail - Quest not found' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePoint(
    @CurrentUser() user: AccessTokenPayload,
    @Body() updatePointRequest: UpdatePointRequest
  ) {
    await this.pointService.updatePoint(user.id, updatePointRequest);
  }
}
