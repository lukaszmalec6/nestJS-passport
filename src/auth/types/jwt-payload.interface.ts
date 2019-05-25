export interface IJwtPayload {
  readonly userId: string;
  readonly sessionKey: string;
  readonly exp: number;
};
