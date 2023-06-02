import { ModuleMetadata } from '@nestjs/common';
import { LoggerOptions } from 'typeorm';

/**
 * log level
 */
export type WinstonLogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

export interface TypeORMLoggerOptions {
    options?: LoggerOptions;
}

/**
 * Log configuration, the default is to cut by the number of days
 */
export interface LoggerModuleOptions {
    /**
     * log file output
     * By default, only log and above (warn and error) logs will be output to the file, and the levels are as follows
     */
    level?: WinstonLogLevel | 'none';

    /**
     * console output level
     */
    consoleLevel?: WinstonLogLevel | 'none';

    /**
     * If enabled, will print the timestamp (difference) between the current and last log message
     */
    timestamp?: boolean;

    /**
     * In the production environment, the terminal log output will be turned off by default, if necessary, it can be set to false
     */
    disableConsoleAtProd?: boolean;

    /**
     * Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb.
     * If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number.
     * default: 2m
     */
    maxFileSize?: string;

    /**
     * Maximum number of logs to keep. If not set,
     * no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix.
     * default: 15d
     */
    maxFiles?: string;

    /**
     * The directory for log output in the development environment, absolute path
     * In order to avoid conflicts and centralized management in the development environment, the logs will be printed in the logs directory under the project directory
     */
    dir?: string;

    /**
     * The log output by any logger's .error() call will be redirected here. The focus is to locate the exception by viewing this log. The default file name is common-error.%DATE%.log
     * NOTE: This filename can contain %DATE% placeholders
     */
    errorLogName?: string;

    /**
     * Application-related logs, logs for application developers. We use it in most cases, the default file name is web.%DATE%.log
     * NOTE: This filename can contain %DATE% placeholders
     */
    appLogName?: string;
}

export interface LoggerModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => LoggerModuleOptions;
    inject?: any[];
}
