// import { Provider } from '@nestjs/common';
// import Redis from 'ioredis';

// export const redisProviders: Provider[] = [
//   {
//     provide: 'REDIS_CLIENT',
//     useFactory: async () => {
//       const redis = new Redis({
//         host: process.env.REDIS_HOST,
//         port: parseInt(process.env.REDIS_PORT),
//       });

//       redis.on('error', (err) => console.error('Redis error:', err));
//       return redis;
//     },
//   },
// ];
