import { Module } from '@nestjs/common';
import { LevelCalculatorService } from './level-calculator.service';

@Module({
  providers: [LevelCalculatorService],
  exports: [LevelCalculatorService],
})
export class LevelCalculatorModule {}
