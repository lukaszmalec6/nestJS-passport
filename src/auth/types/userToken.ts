import {ApiModelProperty} from '@nestjs/swagger';

export class UserToken {
  @ApiModelProperty()
  public readonly accessToken: string;
  @ApiModelProperty()
  public readonly refreshToken: string;
}