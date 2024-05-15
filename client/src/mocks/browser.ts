import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { patchUserProfile, patchUserProfilePhoto, signup } from './handlers/users';
import { getRanking } from './handlers/ranking';
import { getUserInfo } from './handlers/users';
import { createMainQuest, getSubQuest, modiMainQuest, modiSubQuest } from './handlers/quests';

export const handlers = [
  login,
  logout,
  signup,
  getRanking,
  getUserInfo,
  patchUserProfilePhoto,
  patchUserProfile,
  getSubQuest,
  modiSubQuest,
  createMainQuest,
  modiMainQuest,
];

export const worker = setupWorker(...handlers);
