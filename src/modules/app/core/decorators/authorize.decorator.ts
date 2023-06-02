import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE_KEY_METADATA } from '../../contact-app.constants';

/**
 * Open authorization API, using this annotation does not need to verify Token and permissions
 */
export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);
