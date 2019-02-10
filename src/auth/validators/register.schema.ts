import {object, string, ObjectSchema} from 'joi';

export const registerSchema: ObjectSchema = object().keys({
  firstName: string().alphanum().min(3).max(30).required(),
  lastName: string().alphanum().min(3).max(30).required(),
  email: string().email({minDomainAtoms: 2}),
  password: string().regex(/^[0-9a-zA-Z ]+$/).required(),
});