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
} from '@nestjs/common';
import { QuestService } from './quest.service';
import {
  CreateQuestDto,
  CreateQuestRequestDto,
  SubQuestResponseDto,
  UpdateQuestRequestDto,
  UpdateSubQuestRequestDto,
} from '../../common/dto/quest/create-quest.dto';
import { UpdateQuestDto } from '../../common/dto/quest/update-quest.dto';
import { UpdateSideQuestRequestDto } from '../../common/dto/quest/create-side-quest.dto';
import { UpdateSideQuestDto } from '../../common/dto/quest/update-side-quest.dto';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth/auth.interface';
import { Mode } from '../../common/types/quest/quest.type';
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
import { CreateQuestRequest } from '@common/requests/quest';

@Controller('quests')
@ApiTags('Quests API')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post('')
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: '메인 / 서브 퀘스트 완료 상태로 변경' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: PickType(CreateQuestDto, ['status']) })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('main')
  @ApiOperation({ summary: '메인 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: '조회 일자',
    example: '20240521',
  })
  @ApiOkResponse({ type: [CreateQuestDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: AccessTokenPayload, @Query('date') query: string) {
    const queryDate = query
      ? query.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      : new Date().toISOString().split('T')[0];
    return await this.questService.findAll(user.id, Mode.MAIN, queryDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('main/:id')
  @ApiOperation({ summary: '메인 퀘스트 개별 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiOkResponse({ type: CreateQuestDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findOne(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string) {
    return await this.questService.findOne(user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('main/:id')
  @ApiOperation({ summary: '메인 퀘스트 개별 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateQuestRequestDto })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('main/:id')
  @ApiOperation({ summary: '메인 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string) {
    await this.questService.remove(user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('side/:id')
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

  @UseGuards(JwtAuthGuard)
  @Get('sub')
  @ApiOperation({ summary: '서브(일일) 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: '조회 일자',
    example: '20240521',
  })
  @ApiOkResponse({ type: [SubQuestResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAllSub(@CurrentUser() user: AccessTokenPayload, @Query('date') query: string) {
    const queryDate = query
      ? query.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      : new Date().toISOString().split('T')[0];
    return await this.questService.findAll(user.id, Mode.SUB, queryDate);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sub/:id')
  @ApiOperation({ summary: '서브 퀘스트 개별 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateSubQuestRequestDto })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSub(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sub/:id')
  @ApiOperation({ summary: '서브 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSub(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string) {
    await this.questService.remove(user.id, +id);
  }
}
