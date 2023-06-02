import {
    I18nContext,
    I18nValidationError,
    I18nValidationException,
    I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils/util';

@Catch(I18nValidationException)
export class I18nValidationExceptionFilterCustom extends I18nValidationExceptionFilter {
    catch(
        exception: I18nValidationException,
        host: ArgumentsHost,
    ): I18nValidationException {
        const i18n = I18nContext.current();

        const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
            lang: i18n.lang,
        });

        switch (host.getType() as string) {
            case 'http':
                const response = host.switchToHttp().getResponse();
                response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
                    code: HttpStatus.UNPROCESSABLE_ENTITY,
                    //message: exception.getResponse(),
                    message: 'Unprocessable Entity Exception',
                    errors: this.normalizeValidationErrors(errors),
                });
                break;
            case 'graphql':
                exception.errors = this.normalizeValidationErrors(
                    errors,
                ) as I18nValidationError[];
                return exception;
        }
    }
}
