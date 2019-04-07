export interface IConfig {
  auth: {
    salt: string;
    accessToken: {
      secret: string;
      expiresIn: string;
    },
    refreshToken: {
      secret: string;
      expiresIn: string;
    }
  },
  db: {
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
  }
}
