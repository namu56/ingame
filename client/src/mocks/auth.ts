import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const login = http.post(
  `${process.env.REACT_APP_MOCK_API_URL}/${API_END_POINT['LOGIN']}`,
  () => {
    console.log(23);
    return new HttpResponse(JSON.stringify({ message: 'Success' }));
  }
);
