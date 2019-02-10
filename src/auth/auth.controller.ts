import {Controller, Post, Get, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Request as ExpressRequest} from 'express';

import {AuthService} from './auth.service';
import {IToken} from './interfaces/token.interface';
import {ReflectMetadata} from '@nestjs/common';
import {RolesGuard} from './roles.guard';
import {UserRole} from '../user/user.model';
import {JWTStrategySymbols} from './passport/jwt.strategy.symbols';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);
export interface Request extends ExpressRequest {
  user: any;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
  * @api {post} api/auth/register Register new user
  * @apiName Register
  * @apiGroup Auth
  * @apiParam (Request body) {string} firstName user first name
  * @apiParam (Request body) {string} lastName user last name
  * @apiParam (Request body) {string} email user email
  * @apiParam (Request body) {string} password user password
  * @apiParamExample {json} Request-Example:
  *   {
  *   	  "firstName": "Taylor",
  *   	  "lastName": "Swift",
  *   	  "email": "tay.swift@gmail.com",
  *   	  "password": "qwe123"
  *   }
  *
  * @apiSuccess {String} token jwt token
  * @apiSuccessExample Success-Response:
  *    {
  *      "token": "token"
  *    }
  *
  * @apiError BadRequest Email already in use
  * @apiError BadRequest Validation error
  * @apiErrorExample Error-Response:
  *    {
  *      "statusCode": 400,
  *      "error": "Bad Request",
  *      "message": "Validation error: firstName must only contain alpha-numeric characters"
  *    }  
  */
  @Post('register')
  async requestJsonWebTokenAfterLocalSignUp(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user);
  }

  /**
  * @api {post} api/auth/login Login
  * @apiName Login
  * @apiGroup Auth
  * @apiParam (Request body) {string} email user email
  * @apiParam (Request body) {string} password user password
  * @apiParamExample {json} Request-Example:
  *   {
  *   	  "email": "tay.swift@gmail.com",
  *   	  "password": "qwe123"
  *   }
  *
  * @apiSuccess {String} token jwt token
  * @apiSuccessExample Success-Response:
  *    {
  *      "token": "token"
  *    }
  *
  * @apiError Unauthorized Email not found
  * @apiError Unauthorized Wrong password
  * @apiErrorExample Error-Response:
  *    {
  *      "statusCode": 401,
  *      "error": "Unauthorized",
  *      "message": "Wrong password"
  *    }  
  */
  @Post('login')
  async requestJsonWebTokenAfterLocalSignIn(@Req() req: Request): Promise<IToken> {
    return await this.authService.createToken(req.user);
  }

  @Get('authorized')
  @Roles(UserRole.standard)
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt), RolesGuard)
  public async authorized(): Promise<any> {
    return {'message': 'Hello'};
  }
}
