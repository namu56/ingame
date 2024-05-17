import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { patchUserProfile, patchUserProfilePhoto, signup } from './handlers/users';
import { getRanking } from './handlers/ranking';
import { getUserInfo } from './handlers/users';
import { createMainQuest, getMainQuest, getSubQuest, modiMainQuest, modiSideQuest, modiSubQuest } from './handlers/quests';

export const handlers = [
  login,
  logout,
  signup,
  getRanking,
  getUserInfo,
  patchUserProfilePhoto,
  patchUserProfile,
  getMainQuest,
  modiSideQuest,
  getSubQuest,
  modiSubQuest,
  createMainQuest,
  modiMainQuest,
];

export const worker = setupWorker(...handlers);
