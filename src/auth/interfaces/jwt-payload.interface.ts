export interface IJwtPayload {
  readonly userId: string;
  readonly iat: number;
  readonly exp: number;
};
