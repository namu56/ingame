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
} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { CreateSideQuestDto } from './dto/create-side-quest.dto';
import { UpdateSideQuestDto } from './dto/update-side-quest.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../commons/decorators/auth.decorator';
import { JwtPayloadDto } from '../auth/dto/jwt-payload.dto';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: JwtPayloadDto, @Body() createQuestDto: CreateQuestDto) {
    return await this.questsService.create(user.id, createQuestDto);
  }

  @Patch(':id')
  patchComplete(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questsService.update(+id, updateQuestDto);
  }

  @UseGuards(AuthGuard)
  @Get('main')
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: JwtPayloadDto) {
    return this.questsService.findAll(user.id);
  }

  @Get('main/:id')
  findOne(@Param('id') id: string) {
    return this.questsService.findOne(+id);
  }

  @Patch('main/:id')
  update(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questsService.update(+id, updateQuestDto);
  }

  @Delete('main/:id')
  remove(@Param('id') id: string) {
    return this.questsService.remove(+id);
  }

  @Post('side')
  createSide(@Body() createQuestDto: CreateSideQuestDto) {
    return this.questsService.createSide(createQuestDto);
  }

  @Patch('side/:id')
  updateSide(@Param('id') id: string, @Body() updateQuestDto: UpdateSideQuestDto) {
    return this.questsService.updateSide(+id, updateQuestDto);
  }

  @Delete('side/:id')
  removeSide(@Param('id') id: string) {
    return this.questsService.removeSide(+id);
  }

  @Get('sub')
  findAllSub() {
    return this.questsService.findAll();
  }

  @Get('sub/:id')
  findOneSub(@Param('id') id: string) {
    return this.questsService.findOne(+id);
  }

  @Patch('sub/:id')
  updateSub(@Param('id') id: string, @Body() updateQuestDto: UpdateQuestDto) {
    return this.questsService.update(+id, updateQuestDto);
  }

  @Delete('sub/:id')
  removeSub(@Param('id') id: string) {
    return this.questsService.remove(+id);
  }
}
