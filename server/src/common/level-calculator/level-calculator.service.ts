import { LevelInfo } from './level-info.interface';

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
      maxPoint += Math.round(initialExp * Math.pow(1 + increaseRate, level - 1));
    }
  }

  public findLevel(point: number): LevelInfo {
    if (point < this.levelInfoList[0].minPoint) return this.levelInfoList[0];

    const maxLevelIndex = this.levelInfoList.length - 1;
    if (point > this.levelInfoList[maxLevelIndex].maxPoint) {
      return this.levelInfoList[maxLevelIndex];
    }

    const levelInfo = this.levelInfoList.find(
      (levelInfo) => point >= levelInfo.minPoint && point <= levelInfo.maxPoint
    );
    return levelInfo;
  }
}
