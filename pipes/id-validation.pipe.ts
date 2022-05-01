import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERROR } from './id-validation.constants';

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }
    const isValidId = Types.ObjectId.isValid(value);
    if (!isValidId) {
      throw new BadRequestException(ID_VALIDATION_ERROR);
    }
    return value;
  }
}
