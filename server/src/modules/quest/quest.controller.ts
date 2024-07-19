import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from '../../common/dto/quest/create-quest.dto';
import { UpdateQuestDto } from '../../common/dto/quest/update-quest.dto';
import { UpdateSideQuestRequestDto } from '../../common/dto/quest/create-side-quest.dto';
import { UpdateSideQuestDto } from '../../common/dto/quest/update-side-quest.dto';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PickType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@core/guards';
import {
  CreateQuestRequest,
  UpdateMainQuestRequest,
  UpdateQuestStatusRequest,
} from '@common/requests/quest';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';
import { UpdateSubQuestRequest } from '@common/requests/quest/update-sub-quest.request';
import { AccessTokenPayload } from '@common/dto/token';

@Controller('quests')
@ApiTags('Quests API')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 / 서브 퀘스트 생성' })
  @ApiBearerAuth('accessToken')
  @ApiBody({ type: CreateQuestRequest })
  @ApiCreatedResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: AccessTokenPayload, @Body() request: CreateQuestRequest) {
    await this.questService.create(user.id, request);
    return { message: 'success' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 / 서브 퀘스트 완료 상태로 변경' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateQuestStatusRequest })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateQuestStatusRequest
  ) {
    await this.questService.updateQuestStatus(user.id, id, request);
  }

  @Get('main')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: '조회 일자',
    example: '2024-05-21',
  })
  @ApiOkResponse({ type: [MainQuestResponse] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: AccessTokenPayload,
    @Query('date') dateString: string
  ): Promise<MainQuestResponse[]> {
    return await this.questService.findMainQuests(user.id, dateString);
  }

  @Get('main/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 퀘스트 개별 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiOkResponse({ type: MainQuestResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findOne(@CurrentUser() user: AccessTokenPayload, @Param('id', ParseIntPipe) id: number) {
    return await this.questService.findMainQuest(user.id, id);
  }

  @Patch('main/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 퀘스트 개별 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateMainQuestRequest })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMainQuest(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateMainQuestRequest
  ) {
    await this.questService.updateMainQuest(user.id, id, request);
  }

  @Delete('main/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '메인 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMainQuest(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.questService.deleteQuest(user.id, id);
  }

  @Get('sub')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '서브(일일) 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: '조회 일자',
    example: '2024-05-21',
  })
  @ApiOkResponse({ type: [SubQuestResponse] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAllSub(
    @CurrentUser() user: AccessTokenPayload,
    @Query('date') dateString: string
  ): Promise<SubQuestResponse[]> {
    return await this.questService.findSubQuests(user.id, dateString);
  }

  @Patch('sub/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '서브 퀘스트 개별 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateSubQuestRequest })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSub(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateSubQuestRequest
  ) {
    await this.questService.updateSubQuest(user.id, id, request);
  }

  @Delete('sub/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '서브 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubQuest(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.questService.deleteQuest(user.id, id);
  }

  @Patch('side/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '사이드 퀘스트 상태 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '사이드 퀘스트 ID' })
  @ApiBody({ type: UpdateSideQuestRequestDto })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSideStatus(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateSideQuestDto
  ) {
    await this.questService.updateSideStatus(user.id, +id, updateQuestDto);
  }
}
