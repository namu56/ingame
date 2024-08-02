export const Difficulty = {
  DEFAULT: 'default',
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const Mode = {
  MAIN: 'main',
  SUB: 'sub',
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

export const Hidden = {
  TRUE: 'true',
  FALSE: 'false',
} as const;
export type Hidden = (typeof Hidden)[keyof typeof Hidden];

export const Status = {
  COMPLETED: 'completed',
  FAIL: 'fail',
  ON_PROGRESS: 'onProgress',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const ActiveStatus = {
  COMPLETED: 'completed',
  ON_PROGRESS: 'onProgress',
} as const;
