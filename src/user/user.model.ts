import {Table, Column, Model, AllowNull, DataType, Unique, Default} from 'sequelize-typescript';

export enum UserStatus {
  notConfirmed = 'notConfirmed',
  active = 'active',
  banned = 'banned'
}

export enum UserRole {
  standard = 'standard',
  premium = 'premium'  
}

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status?: UserStatus;
  role?: UserRole;
}

@Table({
  tableName: 'user',
})
export class User extends Model<User> {
  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Default(UserStatus.notConfirmed)
  @Column({type: DataType.ENUM(UserStatus.notConfirmed, UserStatus.banned, UserStatus.active)}) 
  status: string;


  @AllowNull(false)
  @Default(UserRole.standard)
  @Column({type: DataType.ENUM(UserRole.premium, UserRole.standard)}) 
  role: string;
}