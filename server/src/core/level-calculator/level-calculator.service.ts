import { LevelInfo } from './interfaces/level-info.interface';

export class LevelCalculatorService {
  private levelInfoList: LevelInfo[] = [];

  constructor(maxLevel: number = 70, initialExp: number = 10, increaseRate: number = 0.1) {
    this.initializedLevelList(maxLevel, initialExp, increaseRate);
  }

  private initializedLevelList(maxLevel: number, initialExp: number, increaseRate: number) {
    let minPoint = 0;
    let maxPoint = initialExp;

    for (let level = 1; level <= maxLevel; level++) {
      this.levelInfoList.push({ level, minPoint, maxPoint });
      minPoint = maxPoint + 1;
      maxPoint += Math.round(initialExp * Math.pow(1 + increaseRate, level));
    }
  }

  public findLevel(point: number): LevelInfo {
    const maxLevelIndex = this.levelInfoList.length - 1;

    if (point > this.levelInfoList[maxLevelIndex].maxPoint) {
      return this.levelInfoList[maxLevelIndex];
    }

    return (
      this.levelInfoList.find(
        (levelInfo) => point >= levelInfo.minPoint && point <= levelInfo.maxPoint
      ) || this.levelInfoList[0]
    );
  }

  public calculateLevelProgress(point: number): number {
    const levelInfo = this.findLevel(point);

    if (!levelInfo) {
      return 0;
    }

    const { minPoint, maxPoint } = levelInfo;
    const levelPoint = maxPoint - minPoint + 1;
    const currentLevePoint = point - minPoint;

    const progress = Math.floor(100 * (currentLevePoint / levelPoint));

    return Math.min(progress, 99);
  }
}
