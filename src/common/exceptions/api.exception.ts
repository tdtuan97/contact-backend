import { HttpException } from '@nestjs/common';
import {
    ErrorCodeMap,
    ErrorCodeMapType,
} from '../contants/error-code.contants';

/**
 * All Api business exceptions throw this exception
 */
export class ApiException extends HttpException {
    /**
     * Business type error code, not Http code
     */
    private errorCode: ErrorCodeMapType;

    constructor(errorCode: ErrorCodeMapType, httpCode = 400) {
        super(ErrorCodeMap[errorCode], httpCode);
        this.errorCode = errorCode;
    }

    getErrorCode(): ErrorCodeMapType {
        return this.errorCode;
    }
}
