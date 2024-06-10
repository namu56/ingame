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
import { AccessTokenPayload } from '../auth/auth.interface';
import { UpdatePointDto } from './dto/update-point.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('point')
@ApiTags('Point API')
export class PointController {
  constructor(private readonly pointService: PointService) {}

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
    @Body() updatePointDto: UpdatePointDto
  ) {
    await this.pointService.updatePoint(user.id, updatePointDto);
  }
}
