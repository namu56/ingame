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
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { CreateSideQuestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { JwtPayload } from '../auth/auth.interface';
import { Mode } from './enums/quest.enum';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: JwtPayload, @Body() createQuestDto: CreateQuestDto) {
    return await this.questsService.create(user.id, createQuestDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
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
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: JwtPayload) {
    return await this.questsService.findAll(user.id, Mode.Main);
  }

  @UseGuards(AuthGuard)
  @Patch('main/:id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.remove(user.id, +id);
  }

  @UseGuards(AuthGuard)
  @Post('side')
  @HttpCode(HttpStatus.OK)
  async createSide(@CurrentUser() user: JwtPayload, @Body() createQuestDto: CreateSideQuestDto[]) {
    return await this.questsService.createSide(user.id, createQuestDto);
  }

  @UseGuards(AuthGuard)
  @Patch('side/:id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSide(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.removeSide(user.id, +id);
  }

  @UseGuards(AuthGuard)
  @Get('sub')
  @HttpCode(HttpStatus.OK)
  async findAllSub(@CurrentUser() user: JwtPayload, @Query('date') query: string) {
    const queryDate = query
      ? new Date(query.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3 00:00:00'))
      : new Date();
    return await this.questsService.findAll(user.id, Mode.Sub, queryDate);
  }

  @UseGuards(AuthGuard)
  @Patch('sub/:id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSub(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.questsService.remove(user.id, +id);
  }
}
