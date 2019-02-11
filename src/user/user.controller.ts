import {Controller, Get, NotFoundException, BadRequestException, Query, Req, UseGuards} from '@nestjs/common';
import {UserSerivce} from './user.service';
import {validate, string} from 'joi';
import {User} from './user.model';
import {Request} from '../interfaces';
import {AuthGuard} from '@nestjs/passport';
import {JWTStrategySymbols} from '../auth/passport/jwt.strategy.symbols';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserSerivce) {}

  /**
     @api {get} api/user/search?email=<email> Search user
     @apiName Search user
     @apiGroup User
     @apiParam (query string) {string} email user email
     @apiSuccess {json} response user data
     @apiSuccessExample Success-Response:
       {
         "id": "cbf2477d-8def-4308-bdfb-808ca4dfe2e4",
         "firstName": "Taylor",
         "lastName": "Swift",
         "email": "tay.swift@gmail.com",
         "password": "#####",
         "status": "notConfirmed",
         "role": "standard"
         "createdAt": "2019-02-11 20:38:43.643+01"
         "updatedAt": "2019-02-11 20:38:43.643+01"
       }
    
     @apiError BadRequest Wrong query param email
     @apiError NotFound User not found
     @apiErrorExample Error-Response:
       {
         "statusCode": 400,
         "error": "Bad Request",
         "message": "Wrong query param email: <email>"
       }  
  */
  @Get('/search')
  async search(@Query() query: {email: string}): Promise<User> {
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

  /**
   @api {get} api/user/profile Logged-in user profile
   @apiName User profile
   @apiGroup User
   @apiSuccess {json} response user profile
   @apiSuccessExample Success-Response:
    {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@gmail.com",
        "status": "notConfirmed",
        "role": "standard",
        "createdAt": "2019-02-11T19:38:43.643Z",
        "updatedAt": "2019-02-11T19:38:43.643Z"
    }
  */

  @Get('/profile')
  @UseGuards(AuthGuard(JWTStrategySymbols.jwt))
  async getUserProfile(@Req() req: Request): Promise<User> {
    return await this.userService.getProfile(req.user.email);
  }
}