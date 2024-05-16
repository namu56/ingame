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
import {
  CreateSideQuestDto,
  SideQuestRequestDto,
  UpdateSideQuestRequestDto,
} from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../auth/auth.interface';
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

@Controller('quests')
@ApiTags('Quests API')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @ApiOperation({ summary: '메인 / 서브 퀘스트 생성' })
  @ApiBearerAuth('accessToken')
  @ApiBody({ type: CreateQuestRequestDto })
  @ApiCreatedResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: JwtPayload, @Body() createQuestDto: CreateQuestDto) {
    return await this.questsService.create(user.id, createQuestDto);
  }

  @UseGuards(AuthGuard)
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
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questsService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(AuthGuard)
  @Get('main')
  @ApiOperation({ summary: '메인 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: [CreateQuestDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.questsService.findAll(user.id, Mode.Main);
  }

  @UseGuards(AuthGuard)
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
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questsService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(AuthGuard)
  @Delete('main/:id')
  @ApiOperation({ summary: '메인 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.remove(user.id, +id);
  }

  @UseGuards(AuthGuard)
  @Post('side')
  @ApiOperation({ summary: '사이드 퀘스트 생성' })
  @ApiBearerAuth('accessToken')
  @ApiBody({ type: [SideQuestRequestDto] })
  @ApiCreatedResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async createSide(@CurrentUser() user: JwtPayload, @Body() createQuestDto: CreateSideQuestDto[]) {
    return await this.questsService.createSide(user.id, createQuestDto);
  }

  @UseGuards(AuthGuard)
  @Patch('side/:id')
  @ApiOperation({ summary: '사이드 퀘스트 개별 수정' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiBody({ type: UpdateSideQuestRequestDto })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSide(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateSideQuestDto
  ) {
    await this.questsService.updateSide(user.id, +id, updateQuestDto);
  }

  @UseGuards(AuthGuard)
  @Delete('side/:id')
  @ApiOperation({ summary: '사이드 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSide(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.removeSide(user.id, +id);
  }

  @UseGuards(AuthGuard)
  @Get('sub')
  @ApiOperation({ summary: '서브(일일) 퀘스트 전체 조회' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ type: [SubQuestResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async findAllSub(@CurrentUser() user: JwtPayload, @Query('date') query: string) {
    const queryDate = query
      ? new Date(query.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3 00:00:00'))
      : new Date();
    return await this.questsService.findAll(user.id, Mode.Sub, queryDate);
  }

  @UseGuards(AuthGuard)
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
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto
  ) {
    await this.questsService.update(user.id, +id, updateQuestDto);
  }

  @UseGuards(AuthGuard)
  @Delete('sub/:id')
  @ApiOperation({ summary: '서브 퀘스트 개별 삭제' })
  @ApiBearerAuth('accessToken')
  @ApiQuery({ name: 'id', type: Number, description: '퀘스트 ID' })
  @ApiNoContentResponse({ description: 'success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'fail - Quests not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSub(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.remove(user.id, +id);
  }
}
