import {Injectable, Inject} from '@nestjs/common';
import {User, IUserData, UserStatus, UserRole} from './user.model';
import {InjectableSymbols} from '../injectable';

@Injectable()
export class UserSerivce {
  constructor(@Inject(InjectableSymbols.userRepository) private readonly userRepository: typeof User) {}

  public async getById(userId: number): Promise<User> {
    try {
      return await this.userRepository.findOne({where: {id: userId}})
    } catch (error) {
      throw new Error(`Can't find user by id: ${userId}: ${error}`);
    }
  }

  public async getByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({where: {email}})
    } catch (error) {
      throw new Error(`Can't find user by email: ${email}: ${error}`);
    }
  }

  public async create(userData: IUserData): Promise<User> {
    try {
      const user = new User();
      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.email = userData.email;
      user.password = userData.password;
      user.status = userData.status || UserStatus.notConfirmed;
      user.role = UserRole.standard;
      return await user.save();
    } catch (error) {
      throw new Error(`Can't save user with data ${JSON.stringify(userData)}: ${error}`);
    }
  }
}