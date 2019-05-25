import {Table, Column, Model, AllowNull, DataType, Unique, Default, PrimaryKey} from 'sequelize-typescript';
import {Injectable} from '@nestjs/common';
import {ApiModelProperty} from '@nestjs/swagger';

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
@Injectable()
@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User> {
  
  @PrimaryKey
  @ApiModelProperty()
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID}) 
  id: string;

  @ApiModelProperty()
  @AllowNull(false)
  @Column
  firstName: string;

  @ApiModelProperty()
  @AllowNull(false)
  @Column
  lastName: string;

  @ApiModelProperty()
  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @ApiModelProperty()
  @AllowNull(false)
  @Default(UserStatus.notConfirmed)
  @Column({type: DataType.ENUM(UserStatus.notConfirmed, UserStatus.banned, UserStatus.active)}) 
  status: string;

  @ApiModelProperty()
  @AllowNull(false)
  @Default(UserRole.standard)
  @Column({type: DataType.ENUM(UserRole.premium, UserRole.standard)}) 
  role: string;
}