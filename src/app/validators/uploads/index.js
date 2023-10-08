import ValidationError from '../../exceptions/ValidationError.js';
import ImageHeadersSchema from './schema.js';

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
    if (validationResult.error) throw new ValidationError(validationResult.error.message);
  },
};

export default UploadsValidator;
