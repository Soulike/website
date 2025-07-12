import Joi from 'joi';

import {User} from './User.js';

export class UserValidator {
  private static readonly schema = Joi.object<User, true>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  public static validate(value: unknown): value is User {
    const validationResult = this.schema.validate(value);
    return !validationResult.error;
  }
}
