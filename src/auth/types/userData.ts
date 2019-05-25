import {ApiModelProperty} from '@nestjs/swagger';

abstract class UserBasic {
  @ApiModelProperty()
  public readonly email: string;
  @ApiModelProperty()
  public readonly password: string;
}

export class UserCreate extends UserBasic {
  @ApiModelProperty()
  public readonly firstName: string;
  @ApiModelProperty()
  public readonly lastName: string;
}

export class UserLogin extends UserBasic {}