import { BadRequestException, Injectable } from '@nestjs/common';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

    public async transform(value, metadata: ArgumentMetadata) {

        const { metatype } = metadata;

        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const entity = plainToClass(metatype, value);

        const errors = await validate(entity, { validationError: { target: false } });

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return entity;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type) && metatype;
    }
}