import {ApiModelProperty} from '@nestjs/swagger';

export class ApiError {
    @ApiModelProperty()
    public readonly statusCode: number;
    @ApiModelProperty()
    public readonly error: string;
    @ApiModelProperty()
    public readonly message: string;
}