import { SetMetadata } from '@nestjs/common';
import { LOG_DISABLED_KEY_METADATA } from '../../contact-app.constants';

/**
 * logging disabled
 */
export const LogDisabled = () => SetMetadata(LOG_DISABLED_KEY_METADATA, true);
