import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Validation exceptions throw this exception
 */
export class ApiValidationException extends HttpException {
    constructor(property: string, message: string | Array<string>) {
        let response = {};
        response[property] = Array.isArray(message) ? message : [message];
        // Customize for flutter app
        response['message_app'] = response[property][0];
        super(response, HttpStatus.UNPROCESSABLE_ENTITY);
        this.message = 'Unprocessable Entity Exception';
    }
}
