import {object, string, ObjectSchema} from 'joi';

export const loginSchema: ObjectSchema = object().keys({
  email: string().email({minDomainAtoms: 2}),
  password: string().regex(/^[0-9a-zA-Z ]+$/).required(),
});