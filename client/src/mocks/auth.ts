import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import dotenv from 'dotenv';

dotenv.config();

export const login = http.post(
  `${process.env.REACT_APP_MOCK_API_URL}/${API_END_POINT['LOGIN']}`,
  () => {
    return HttpResponse.json({
      status: 200,
      statusText: '성공',
    });
  }
);
