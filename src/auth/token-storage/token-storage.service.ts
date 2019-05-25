import {Injectable} from '@nestjs/common';
import * as redis from 'redis';
import * as util from 'util';
import {RedisKeyPrefix, IRedisClient} from './interfaces/token-storage.interfaces';

import {HyperLogger} from '../../_common/logger';
import {ConfigService} from '../../config/config.service';

@Injectable()
export class TokenStorageService {
  private readonly client: IRedisClient;

  constructor(
    private readonly logger: HyperLogger,
    private readonly config: ConfigService) {
    try {
      this.client = redis.createClient({
        host: config.get(`REDIS_HOST`),
        port: config.get(`REDIS_PORT`),
        connection_strategy: options => {
          if (options.error && options.error.code === `ECONNREFUSED`) {
            return new Error(`The server refused the connection`);
          }
          return 1000;
        },
        retry_strategy: options => {
          if (options.attempt >= 1) {
            logger.err(`Redis`, `Connection error`, options.error);
            return new Error(`Redis unavailable`);
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });
      this.client.on(`error`, (error) => logger.err(`Redis`, `Connection error`, error));
      this.client.on(`connect`, () => logger.info(`Redis`, `Redis storage connected on ${this.client[`address`]}`));
      this.client.get = util.promisify(this.client.get).bind(this.client);
      this.client.set = util.promisify(this.client.set).bind(this.client);
      this.client.scan = util.promisify(this.client.scan).bind(this.client);
      this.client.del = util.promisify(this.client.del).bind(this.client);
    } catch (error) {
      throw new Error(`Creating redis client failed: ${error}`)
    }
  }

  public async saveTokens(userId: string, accessToken: string, refreshToken: string, sessionKey: string): Promise<void> {
    try {
      await this.client.set(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey), accessToken);
      await this.client.set(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey), refreshToken);
    } catch (error) {
      throw new Error(`Error while saving access tokens for user id: ${userId}, ${error}`);
    }
  }

  public async getAccessToken(userId: string, sessionKey: string): Promise<string> {
    try {
      return await this.client.get(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey));
    } catch (error) {
      throw new Error(`Error while getting access token for user id: ${userId}, ${error}`);
    }
  }

  public async getRefreshToken(userId: string, sessionKey: string): Promise<string> {
    try {
      return await this.client.get(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey));
    } catch (error) {
      throw new Error(`Error while getting refresh token for user id: ${userId}, ${error}`);
    }
  }

  public async deleteTokens(userId: string, sessionKey: string): Promise<{deletedCount: number}> {
    try {
      return {
        deletedCount:
          await this.client.del(this.getKey(RedisKeyPrefix.accessToken, userId, sessionKey)) +
          await this.client.del(this.getKey(RedisKeyPrefix.refreshToken, userId, sessionKey))
      };
    } catch (error) {
      throw new Error(`Error while deleting tokens for user id: ${userId}, ${error}`);
    }
  }

  private getKey(prefix: RedisKeyPrefix, userId: string, sessionKey: string): string {
    return `${prefix}:${userId}:${sessionKey}`;
  }

}
