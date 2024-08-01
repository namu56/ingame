import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SideQuestService } from './side-quest.service';
import { JwtAuthGuard } from '@core/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateQuestStatusRequest } from '@common/requests/quest';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { AccessTokenPayload } from '@common/dto/token';

@Controller('quests/side')
export class SideQuestController {
  constructor(private readonly sideQuestService: SideQuestService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사이드 퀘스트 상태 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '사이드 퀘스트 ID' })
  @ApiBody({ type: UpdateQuestStatusRequest })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSideQuestStatus(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateQuestStatusRequest
  ) {
    await this.sideQuestService.updateSideQuestStatus(user.id, id, request);
  }
}
