import {ApiOkResponse, ApiBadRequestResponse, ApiImplicitBody, ApiUnauthorizedResponse, ApiImplicitHeader, ApiUseTags} from '@nestjs/swagger';
import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {Request, ApiError} from '../_common/interfaces';
import {JWTStrategySymbols} from '../injectable';
import {UserCreate, UserToken, UserLogin} from './types';
@ApiUseTags(`auth`)
@Controller(`api/auth`)
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post(`register`)
  @ApiImplicitBody({name: `User Data`, type: UserCreate})
  @ApiOkResponse({description: `Account created`, type: UserToken})
  @ApiBadRequestResponse({description: `Email already in use / validation error`, type: ApiError})
  public register(@Req() req: Request): Promise<UserToken> {
    return this.authService.createToken(req.user.id);
  }

  @Post(`login`)
  @ApiImplicitBody({name: `User Data`, type: UserLogin})
  @ApiOkResponse({description: `Logged In`, type: UserToken})
  @ApiUnauthorizedResponse({description: `Incorret credentials`, type: ApiError})
  public login(@Req() req: Request): Promise<UserToken> {
    return this.authService.createToken(req.user.id);
  }


  @Post(`refresh`)
  @ApiImplicitHeader({name: `Authorization`, required: true, description: `Bearer {refresh token}`})
  @ApiOkResponse({description: `Refreshed`, type: UserToken})
  @ApiUnauthorizedResponse({description: `Bad refresh token`, type: ApiError})
  public async refreshToken(@Req() req: Request): Promise<UserToken> {
    await this.authService.destroyTokens(req.user.id, req.sessionKey);
    return this.authService.createToken(req.user.id);
  }

  @Post(`logout`)
  @ApiImplicitHeader({name: `Authorization`, required: true, description: `Bearer {access token}`})
  @ApiOkResponse({description: `Logged out`})
  @ApiUnauthorizedResponse({description: `Unauthorized`, type: ApiError})
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public logout(@Req() req: Request): Promise<boolean> {
    return this.authService.destroyTokens(req.user.id, req.sessionKey);
  }
}
