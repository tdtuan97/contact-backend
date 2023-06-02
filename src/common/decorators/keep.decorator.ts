import { SetMetadata } from '@nestjs/common';
import { TRANSFORM_KEEP_KEY_METADATA } from '../contants/decorator.contants';

/**
 * Do not convert into JSON structure, keep the original return
 */
export const Keep = () => SetMetadata(TRANSFORM_KEEP_KEY_METADATA, true);
