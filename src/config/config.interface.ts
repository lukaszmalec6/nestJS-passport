export interface IConfig {
  auth: {
    authSecret: string;
    authTokenExpiresIn: string;
    salt: string;
  },
  db: {
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
  }
}
