export enum RedisKeyPrefix {
  accessToken = 'at',
  refreshToken = 'rt'
}

export interface IRedisClient {
  on: any;
  set: (key: string, value: string) => Promise<any>;
  get: (key: string) => Promise<string>;
  // await this.client.scan('0', `MATCH`, `*`, `COUNT`, 1000);
  scan: (cursor: string, type: string, pattern: string, func: string, maxCount: number) => Promise<{cursor: string, keys: string[]}>;
  del: (key: string) => Promise<number>;
}