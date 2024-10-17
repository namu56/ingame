import { QuestMode } from '@/models/quest.model';

export const BASE_KEY = {
  USER: 'USER',
  QUEST: 'QUEST',
  RANKING: 'RANKING',
};

export const USER = {
  GET_USERINFO: [BASE_KEY.USER],
};

export const QUEST = {
  GET_SUBQUEST: [BASE_KEY.QUEST, 'SUB' as QuestMode],
  GET_MAINQUEST: [BASE_KEY.QUEST, 'MAIN' as QuestMode],
};

export const RANK = {
  GET_RANKING: [BASE_KEY.RANKING],
};
