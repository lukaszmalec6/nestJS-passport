import {
  ApiUseTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiImplicitQuery,
  ApiImplicitHeader,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {Controller, Get, NotFoundException, BadRequestException, Query, Req, UseGuards} from '@nestjs/common';
import {UserSerivce} from './user.service';
import {validate, string} from 'joi';
import {User} from './user.model';
import {Request, ApiError} from '../_common/types';
import {AuthGuard} from '@nestjs/passport';
import {JWTStrategySymbols} from '../injectable';

@ApiUseTags(`user`)
@Controller(`api/user`)
export class UserController {
  constructor(
    private readonly userService: UserSerivce
  ) {}
  
  @Get(`/search`)
  @ApiImplicitQuery({name:`email`, description: `Searched user email`, type: string})
  @ApiOkResponse({description: `User found`, type: User})
  @ApiBadRequestResponse({description: `Wrong email`, type: ApiError})
  @ApiNotFoundResponse({description: `User not found`, type: ApiError})
  @ApiImplicitHeader({name: `Authorization`, required: true, description: `Bearer {access token}`})
  public async search(@Query() query: {email: string}): Promise<User> {
    const {email} = query;
    if (validate(email, string().email({minDomainAtoms: 2})).error) {
      throw new BadRequestException(`Wrong query param email: ${email}`);
    }
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  @Get(`/profile`)
  @ApiOkResponse({description: `User profile`, type: User})
  @ApiUnauthorizedResponse({description: `Unathorized`, type: ApiError})
  @ApiImplicitHeader({name: `Authorization`, required: true, description: `Bearer {access token}`})
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public getUserProfile(@Req() req: Request): Promise<User> {
    return this.userService.getProfile(req.user.email);
  }
}