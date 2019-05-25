import {Controller, Post, Get, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {IToken} from './interfaces/token.interface';
import {RolesGuard} from '../_common/guards/roles.guard';
import {UserRole} from '../user/user.model';
import {Request} from '../_common/interfaces';
import {Roles} from '../_common/decorators';
import {JWTStrategySymbols} from '../injectable';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  /**
   @api {post} api/auth/register Register new user
   @apiName Register
   @apiGroup Auth
   @apiParam (Request body) {string} firstName user first name
   @apiParam (Request body) {string} lastName user last name
   @apiParam (Request body) {string} email user email
   @apiParam (Request body) {string} password user password
   @apiParamExample {json} Request-Example:
      {
      	  "firstName": "Taylor",
      	  "lastName": "Swift",
      	  "email": "tay.swift@gmail.com",
      	  "password": "qwe123"
      }
   @apiSuccess {String} token jwt token
   @apiSuccessExample Success-Response:
      {
        "accessToken": "token",
        "refreshToken": "refreshToken"
      }
   @apiError BadRequest Email already in use
   @apiError BadRequest Validation error
   @apiErrorExample Error-Response:
      {
        "statusCode": 400,
        "error": "Bad Request",
        "message": "Validation error: firstName must only contain alpha-numeric characters"
      }  
  */
  @Post('register')
  public async register(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user.id);
  }

  /**
   @api {post} api/auth/login Login
   @apiName Login
   @apiGroup Auth
   @apiParam (Request body) {string} email user email
   @apiParam (Request body) {string} password user password
   @apiParamExample {json} Request-Example:
     {
     	  "email": "tay.swift@gmail.com",
     	  "password": "qwe123"
     }
   @apiSuccess {String} token jwt token
   @apiSuccessExample Success-Response:
      {
        "accessToken": "token",
        "refreshToken": "refreshToken"
      }
   @apiError Unauthorized Email not found
   @apiError Unauthorized Wrong password
   @apiErrorExample Error-Response:
      {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": "Wrong password"
      }  
  */

  @Post('login')
  public async login(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user.id);
  }


  /**
  @api {post} api/auth/refresh Refresh access token
  @apiName Refresh
  @apiGroup Auth 
  @apiHeader {String} Authorization Refresh token
  @apiHeaderExample {json} Header-example: {
     "Authorization": "Bearer refreshToken" 
    }
  @apiSuccess {String} token jwt token
  @apiSuccessExample Success-Response:
    {
      "accessToken": "token",
      "refreshToken": "refreshToken"
    }
  @apiError Unauthorized Refresh token has expired
  @apiError Unauthorized Invalid refresh token
  @apiErrorExample Error-Response:
    {
      "statusCode": 401,
      "error": "Unauthorized",
      "message": "Refresh token has expired"
    }  
  */

  @Post('refresh')
  public async refreshToken(@Req() req: Request): Promise<IToken> {
    await this.authService.destroyTokens(req.user.id, req.sessionKey);
    return await this.authService.createToken(req.user.id);
  }

  /**
   @api {post} api/auth/logout Logout
   @apiName Logout
   @apiGroup Auth 
   @apiHeader {String} Authorization access token
   @apiHeaderExample {json} Header-example: {
       "Authorization": "Bearer accessToken" 
    }
   @apiError Unauthorized Access token has expired
   @apiError Unauthorized Invalid access token
   @apiErrorExample Error-Response:
      {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": "Access token has expired"
      }  
  */
  @Post('logout')
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  public async logout(@Req() req: Request): Promise<boolean> {
    return await this.authService.destroyTokens(req.user.id, req.sessionKey);
  }

  @Get('authorized')
  @Roles(UserRole.standard)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async authorized(): Promise<any> {
    return {'message': 'Hello'};
  }
}
