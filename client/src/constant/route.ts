export const ROUTERS = {
  MAIN: '/',
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
  },
  RANK: '/ranking',
  CREATEQUEST: '/createquest',
  TEST: '/test',
} as const;

type ValueOf<T> = T[keyof T];
type RecursiveValueOf<T> = T extends object ? RecursiveValueOf<ValueOf<T>> : T;

export type Routers = RecursiveValueOf<typeof ROUTERS>;
