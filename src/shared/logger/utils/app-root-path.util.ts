import { parse, resolve, join } from 'path';
import { existsSync } from 'fs';

/**
 * Get the application root directory
 * @returns application root directory
 */
export function getAppRootPath(): string {
    // Check for environmental variable
    if (process.env.APP_ROOT_PATH) {
        return resolve(process.env.APP_ROOT_PATH);
    }
    // Find the node_modules directory step by step
    let cur = __dirname;
    const root = parse(cur).root;

    let appRootPath = '';
    while (cur) {
        if (
            existsSync(join(cur, 'node_modules')) &&
            existsSync(join(cur, 'package.json'))
        ) {
            // If there are node_modules, package.json
            appRootPath = cur;
        }
        // Already the root path, no need to look up
        if (root === cur) {
            break;
        }

        // keep looking up
        cur = resolve(cur, '..');
    }

    if (appRootPath) {
        process.env.APP_ROOT_PATH = appRootPath;
    }
    return appRootPath;
}
