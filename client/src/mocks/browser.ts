import { login, logout } from './handlers/auth';
import { setupWorker } from 'msw/browser';
import { patchUserProfilePhoto, signup } from './handlers/users';
import { getRanking } from './handlers/ranking';
import { getUserInfo } from './handlers/users';

export const handlers = [login, logout, signup, getRanking, getUserInfo, patchUserProfilePhoto];

export const worker = setupWorker(...handlers);
