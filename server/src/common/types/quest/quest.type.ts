export const Difficulty = {
  Default: 'DEFAULT',
  Easy: 'EASY',
  Normal: 'NORMAL',
  Hard: 'HARD',
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const Mode = {
  Main: 'MAIN',
  Sub: 'SUB',
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

export const Hidden = {
  True: 'TRUE',
  False: 'FALSE',
} as const;
export type Hidden = (typeof Hidden)[keyof typeof Hidden];

export const Status = {
  Completed: 'COMPLETED',
  Fail: 'FAIL',
  OnProgress: 'ON_PROGRESS',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const ActiveStatus = {
  Completed: 'COMPLETED',
  OnProgress: 'ON_PROGRESS',
} as const;
