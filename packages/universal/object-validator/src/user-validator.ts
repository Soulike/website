import Joi from 'joi';

export class UserValidator {
  private static readonly schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  public static validate(value: unknown): boolean {
    const {error} = this.schema.validate(value);
    return !error;
  }
}
