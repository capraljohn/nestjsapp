import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { NO_VALID_ERROR } from './ad-validation.constans';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type != 'param') {
		return value;

		}
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(NO_VALID_ERROR);
		}
		return value;
	}
}