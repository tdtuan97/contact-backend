import { join } from 'path';
import {
    Injectable,
    Optional,
    Inject,
    LoggerService as NestLoggerService,
} from '@nestjs/common';
import { clc, yellow } from '@nestjs/common/utils/cli-colors.util';
import { createLogger, Logger as WinstonLogger, format } from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { isDev } from 'src/config/env';
import { isPlainObject } from 'lodash';
import { getAppRootPath } from './utils/app-root-path.util';
import { LoggerModuleOptions, WinstonLogLevel } from './logger.interface';
import {
    DEFAULT_ERROR_LOG_NAME,
    DEFAULT_MAX_SIZE,
    DEFAULT_WEB_LOG_NAME,
    LOGGER_MODULE_OPTIONS,
    PROJECT_LOG_DIR_NAME,
} from './logger.constants';

/**
 * Default output log level
 */
const DEFAULT_LOG_CONSOLE_LEVELS: WinstonLogLevel = isDev() ? 'info' : 'error';
const DEFAULT_LOG_WINSTON_LEVELS: WinstonLogLevel = 'info';

/**
 * The log output level is based on the Nest configuration extension and works with winston.
 * Since the log level conflicts with the definition of winston, it needs to be converted to info
 * https://github.com/nestjs/nest/blob/master/packages/common/services/utils/is-log-level-enabled.util.ts
 */
const LOG_LEVEL_VALUES: Record<WinstonLogLevel, number> = {
    debug: 4,
    verbose: 3,
    info: 2,
    warn: 1,
    error: 0,
};

@Injectable()
export class LoggerService implements NestLoggerService {
    private static lastTimestampAt?: number;
    /**
     * Log file storage folder path
     */
    private logDir: string;

    /**
     * instance of winston
     */
    private winstonLogger: WinstonLogger;

    constructor();
    constructor(context: string, options: LoggerModuleOptions);
    constructor(
        @Optional() protected context?: string,
        @Optional()
        @Inject(LOGGER_MODULE_OPTIONS)
        protected options: LoggerModuleOptions = {},
    ) {
        // default allocation
        this.options.timestamp === undefined && (this.options.timestamp = true);
        // file output level
        !this.options.level &&
            (this.options.level = DEFAULT_LOG_WINSTON_LEVELS);
        // console output level
        !this.options.consoleLevel &&
            (this.options.consoleLevel = DEFAULT_LOG_CONSOLE_LEVELS);
        // output file size
        !this.options.maxFileSize &&
            (this.options.maxFileSize = DEFAULT_MAX_SIZE);
        // Default output file name
        !this.options.appLogName &&
            (this.options.appLogName = DEFAULT_WEB_LOG_NAME);
        !this.options.errorLogName &&
            (this.options.errorLogName = DEFAULT_ERROR_LOG_NAME);

        // initialize winston
        this.initWinston();
    }

    /**
     * Initialize winston
     */
    private initWinston() {
        // Configure the log output directory
        if (this.options.dir) {
            this.logDir = this.options.dir;
        } else {
            // If not specified, use the current project directory + logs path to save
            this.logDir = join(getAppRootPath(), PROJECT_LOG_DIR_NAME);
        }
        const transportOptions: WinstonDailyRotateFile.DailyRotateFileTransportOptions =
            {
                dirname: this.logDir,
                maxSize: this.options.maxFileSize,
                maxFiles: this.options.maxFiles,
            };
        // multi-way log
        const webTransport = new WinstonDailyRotateFile(
            Object.assign(transportOptions, {
                filename: this.options.appLogName,
            }),
        );
        // All error levels are recorded under this file
        const errorTransport = new WinstonDailyRotateFile(
            Object.assign(transportOptions, {
                filename: this.options.errorLogName,
                level: 'error',
            }),
        );
        // Initialize winston
        this.winstonLogger = createLogger({
            level: this.options.level,
            format: format.json({
                space: 0,
            }),
            levels: LOG_LEVEL_VALUES,
            transports: [webTransport, errorTransport],
        });
    }

    /**
     * Get the log storage path
     */
    protected getLogDir(): string {
        return this.logDir;
    }

    /**
     * Get winston instance
     */
    protected getWinstonLogger(): WinstonLogger {
        return this.winstonLogger;
    }

    /**
     * Write a 'info' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    log(message: any, ...optionalParams: any[]) {
        const consoleEnable = this.isConsoleLevelEnabled('info');
        const winstonEnable = this.isWinstonLevelEnabled('info');
        if (!consoleEnable && !winstonEnable) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        if (consoleEnable) {
            this.printMessages(messages, context, 'info');
        }
        this.recordMessages(messages, context, 'info');
    }

    /**
     * Write an 'error' level log, if the configured level allows for it.
     * Prints to `stderr` with newline.
     */
    error(message: any, context?: string): void;
    error(message: any, stack?: string, context?: string): void;
    error(message: any, ...optionalParams: [...any, string?, string?]): void;
    error(message: any, ...optionalParams: any[]) {
        const consoleEnable = this.isConsoleLevelEnabled('error');
        const winstonEnable = this.isWinstonLevelEnabled('error');
        if (!consoleEnable && !winstonEnable) {
            return;
        }
        const { messages, context, stack } =
            this.getContextAndStackAndMessagesToPrint([
                message,
                ...optionalParams,
            ]);
        if (consoleEnable) {
            this.printMessages(messages, context, 'error', 'stderr');
            this.printStackTrace(stack);
        }
        this.recordMessages(messages, context, 'error', stack);
    }

    /**
     * Write a 'warn' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    warn(message: any, context?: string): void;
    warn(message: any, ...optionalParams: [...any, string?]): void;
    warn(message: any, ...optionalParams: any[]) {
        const consoleEnable = this.isConsoleLevelEnabled('warn');
        const winstonEnable = this.isWinstonLevelEnabled('warn');
        if (!consoleEnable && !winstonEnable) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        if (consoleEnable) {
            this.printMessages(messages, context, 'warn');
        }
        this.recordMessages(messages, context, 'warn');
    }

    /**
     * Write a 'debug' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    debug(message: any, context?: string): void;
    debug(message: any, ...optionalParams: [...any, string?]): void;
    debug(message: any, ...optionalParams: any[]) {
        const consoleEnable = this.isConsoleLevelEnabled('debug');
        const winstonEnable = this.isWinstonLevelEnabled('debug');
        if (!consoleEnable && !winstonEnable) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        if (consoleEnable) {
            this.printMessages(messages, context, 'debug');
        }
        this.recordMessages(messages, context, 'debug');
    }

    /**
     * Write a 'verbose' level log, if the configured level allows for it.
     * Prints to `stdout` with newline.
     */
    verbose(message: any, context?: string): void;
    verbose(message: any, ...optionalParams: [...any, string?]): void;
    verbose(message: any, ...optionalParams: any[]) {
        const consoleEnable = this.isConsoleLevelEnabled('verbose');
        const winstonEnable = this.isWinstonLevelEnabled('verbose');
        if (!consoleEnable && !winstonEnable) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        if (consoleEnable) {
            this.printMessages(messages, context, 'verbose');
        }
        this.recordMessages(messages, context, 'verbose');
    }

    protected isConsoleLevelEnabled(level: WinstonLogLevel): boolean {
        // Disable production mode console log output by default
        if (!isDev() && !this.options.disableConsoleAtProd) {
            return false;
        }
        if (this.options.consoleLevel === 'none') {
            return false;
        }
        return LOG_LEVEL_VALUES[level] <= LOG_LEVEL_VALUES[level];
    }

    protected isWinstonLevelEnabled(level: WinstonLogLevel): boolean {
        // Disable production mode console log output by default
        if (this.options.level === 'none') {
            return false;
        }
        return LOG_LEVEL_VALUES[level] <= LOG_LEVEL_VALUES[level];
    }

    // code from -> https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
    protected getTimestamp(): string {
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        return new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions as Intl.DateTimeFormatOptions,
        );
    }

    protected recordMessages(
        messages: unknown[],
        context = '',
        logLevel: WinstonLogLevel = 'info',
        stack?: string,
    ) {
        messages.forEach((message) => {
            const output = isPlainObject(message)
                ? JSON.stringify(
                      message,
                      (_, value) =>
                          typeof value === 'bigint' ? value.toString() : value,
                      0,
                  )
                : (message as string);

            this.winstonLogger.log(logLevel, output, {
                context,
                stack,
                pid: process.pid,
                timestamp: this.getTimestamp(),
            });
        });
    }

    protected printMessages(
        messages: unknown[],
        context = '',
        logLevel: WinstonLogLevel = 'info',
        writeStreamType?: 'stdout' | 'stderr',
    ) {
        const color = this.getColorByLogLevel(logLevel);
        messages.forEach((message) => {
            const output = isPlainObject(message)
                ? `${color('Object:')}\n${JSON.stringify(
                      message,
                      (_, value) =>
                          typeof value === 'bigint' ? value.toString() : value,
                      2,
                  )}\n`
                : color(message as string);

            const pidMessage = color(`[Nest] ${process.pid}  - `);
            const contextMessage = context ? yellow(`[${context}] `) : '';
            const timestampDiff = this.updateAndGetTimestampDiff();
            const formattedLogLevel = color(
                logLevel.toUpperCase().padStart(7, ' '),
            );
            const computedMessage = `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;

            process[writeStreamType ?? 'stdout'].write(computedMessage);
        });
    }

    protected printStackTrace(stack: string) {
        if (!stack) {
            return;
        }
        process.stderr.write(`${stack}\n`);
    }

    private updateAndGetTimestampDiff(): string {
        const includeTimestamp =
            LoggerService.lastTimestampAt && this.options?.timestamp;
        const result = includeTimestamp
            ? yellow(` +${Date.now() - LoggerService.lastTimestampAt}ms`)
            : '';
        LoggerService.lastTimestampAt = Date.now();
        return result;
    }

    private getContextAndMessagesToPrint(args: unknown[]) {
        if (args?.length <= 1) {
            return { messages: args, context: this.context };
        }
        const lastElement = args[args.length - 1];
        const isContext = typeof lastElement === 'string';
        if (!isContext) {
            return { messages: args, context: this.context };
        }
        return {
            context: lastElement as string,
            messages: args.slice(0, args.length - 1),
        };
    }

    private getContextAndStackAndMessagesToPrint(args: unknown[]) {
        const { messages, context } = this.getContextAndMessagesToPrint(args);
        if (messages?.length <= 1) {
            return { messages, context };
        }
        const lastElement = messages[messages.length - 1];
        const isStack = typeof lastElement === 'string';
        if (!isStack) {
            return { messages, context };
        }
        return {
            stack: lastElement as string,
            messages: messages.slice(0, messages.length - 1),
            context,
        };
    }

    private getColorByLogLevel(
        level: WinstonLogLevel,
    ): (text: string) => string {
        switch (level) {
            case 'debug':
                return clc.magentaBright;
            case 'warn':
                return clc.yellow;
            case 'error':
                return clc.red;
            case 'verbose':
                return clc.cyanBright;
            default:
                return clc.green;
        }
    }
}
