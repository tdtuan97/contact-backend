import { SetMetadata } from '@nestjs/common';
import { PERMISSION_OPTIONAL_KEY_METADATA } from '../../contact-app.constants';

/**
 * Use this annotation to open the current Api permission without permission access, but still need to verify the identity Token
 */
export const PermissionOptional = () =>
    SetMetadata(PERMISSION_OPTIONAL_KEY_METADATA, true);
