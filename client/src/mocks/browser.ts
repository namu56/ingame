import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { patchUserProfile, signup } from './handlers/users';
import { getRanking } from './handlers/ranking';
import { getUserInfo } from './handlers/users';
import { getSubQuest, modiSubQuest } from './handlers/quests';

export const handlers = [
  login,
  logout,
  signup,
  getRanking,
  getUserInfo,
  patchUserProfile,
  getSubQuest,
  modiSubQuest,
];

export const worker = setupWorker(...handlers);
