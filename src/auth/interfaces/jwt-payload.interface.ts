export interface IJwtPayload {
  readonly userId: number;
  readonly iat: number;
  readonly exp: number;
};
