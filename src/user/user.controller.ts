import {Response, Controller, Get, Param, NotFoundException, BadRequestException, Next, Res} from '@nestjs/common';
import {UserSerivce} from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserSerivce) {}

  /**
  * @api {get} api/user/:userId Get user data
  * @apiName Login
  * @apiGroup User
  * @apiParam {number} userId user id
  * @apiSuccess {json} response user data
  * @apiSuccessExample Success-Response:
  *   {
  *     "id": 4,
  *     "firstName": "Taylor",
  *     "lastName": "Swift",
  *     "email": "tay.swift@gmail.com",
  *     "password": "#####",
  *     "status": "notConfirmed",
  *     "role": "standard"
  *   }
  *
  * @apiError BadRequest Wrong param userId
  * @apiError NotFound User not found
  * @apiErrorExample Error-Response:
  *   {
  *     "statusCode": 400,
  *     "error": "Bad Request",
  *     "message": "Wrong param userId: %%"
  *   }  
  */
  @Get('/:userId')
  async get(@Param() params: {userId: number}) {
    const {userId} = params;
    if (isNaN(userId)) {
      throw new BadRequestException(`Wrong param userId: ${userId}`);
    }
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }
}