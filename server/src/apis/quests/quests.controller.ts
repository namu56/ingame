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
import { QuestsService } from './quests.service';
import {
  CreateQuestDto,
  CreateQuestRequestDto,
  SubQuestResponseDto,
  UpdateQuestRequestDto,
  UpdateSubQuestRequestDto,
} from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UpdateSideQuestRequestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth/auth.interface';
import { Mode } from './enums/quest.enum';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quests')
@ApiTags('Quests API')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiOperation({ summary: '메인 / 서브 퀘스트 생성' })
  @ApiBearerAuth('accessToken')
  @ApiBody({ type: CreateQuestRequestDto })
  @ApiCreatedResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: AccessTokenPayload, @Body() createQuestDto: CreateQuestDto) {
    return await this.questsService.create(user.id, createQuestDto);
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
    await this.questsService.update(user.id, +id, updateQuestDto);
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
    return await this.questsService.findAll(user.id, Mode.Main, queryDate);
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
    return await this.questsService.findOne(user.id, +id);
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
    await this.questsService.update(user.id, +id, updateQuestDto);
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
    await this.questsService.remove(user.id, +id);
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
    await this.questsService.updateSideStatus(user.id, +id, updateQuestDto);
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
    return await this.questsService.findAll(user.id, Mode.Sub, queryDate);
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
    await this.questsService.update(user.id, +id, updateQuestDto);
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
    await this.questsService.remove(user.id, +id);
  }
}
