import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { patchUserProfile, signup } from './handlers/users';
import { getRanking } from './handlers/ranking';
import { getUserInfo } from './handlers/users';

export const handlers = [login, logout, signup, getRanking, getUserInfo, patchUserProfile];

export const worker = setupWorker(...handlers);
