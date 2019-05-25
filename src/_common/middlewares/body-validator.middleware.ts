import {MiddlewareFunction, BadRequestException} from '@nestjs/common';
 import{Request, Response} from 'express';
import {validate, ObjectSchema} from 'joi';

export const bodyValidator: MiddlewareFunction = (validatorSchema: ObjectSchema) =>
  (req: Request, res: Response, next: Function) => {
    const result = validate(req.body, validatorSchema);
    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');
      return next(new BadRequestException(`Validation error: ${message}`));
    }
    next();
  };
