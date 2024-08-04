import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) { }

  transform(value: any, metadata: ArgumentMetadata) {

    if (metadata.type !== 'body') {
      return value;
    }

    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.details.map(err => err.message).join(', '));
    }
    return value;
  }
}
