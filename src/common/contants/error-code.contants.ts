/**
 * Error Code
 */
export const ERROR_CODE = {
    // 10000 - 99999 business operation error
    // Token related
    // OSS-related
} as const;

export type ERROR_CODE_TYPE = keyof typeof ERROR_CODE;

/**
 * Unified error code definition
 */
export const ErrorCodeMap = {
    // HTTP error
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',

    // 10000 - 99999 business operation error
    10000: 'parameter verification exception',
    10001: 'The system user already exists',
    10002: 'The verification code is incorrect',
    10003: 'The username and password are incorrect',
    10004: 'Node route already exists',
    10005: 'Permission must include parent node',
    10006: 'Illegal operation: this node only supports directory type parent nodes',
    10007: 'Illegal operation: node type cannot be directly converted',
    10008: 'There is an associated user for this role, please delete the associated user first',
    10009: 'There is an associated user in this department, please delete the associated user first',
    10010: 'There is an associated role in this department, please delete the associated role first',
    10015: 'There are sub-departments in this department, please delete the sub-departments first',
    10011: 'The old password is inconsistent with the original password',
    10012: 'If you want to log out, you can log out in the upper right corner',
    10013: 'The user is not allowed to go offline',
    10014: 'The parent menu does not exist',
    10016: 'The built-in function of the system does not allow operation',
    10017: 'User does not exist',
    10018: "Unable to find the current user's department",
    10019: 'Department does not exist',
    10020: 'Task does not exist',
    10021: 'The parameter configuration key-value pair already exists',
    10101: 'Unsafe task, make sure to add the @Mission annotation',
    10102: 'The task being executed does not exist',

    // Transaction Error
    10200: 'Not found transaction',
    10201: 'Your device is currently charging. Please stop the charging before starting a new device.',

    // token related
    11001: 'Invalid login or no access',
    11002: 'The login identity has expired',
    11003: 'No permission, please contact the administrator to apply for permission',

    // Steve System Error
    12100: 'The user or tag already exists in Steve System',

    12200: 'Fail to start transaction',
    12201: 'Fail to stop transaction',
    12203: 'Transaction ID is invalid',
    12204: 'Transaction not exist.',

    12210: 'Charge box is offline.',

    12220: 'Please plug connector',
    12221: 'Please re-plug connector',

    12500: 'Connect ECONNREFUSED Steve System',

    // OSS-related
    20001: 'The currently created file or directory already exists',
    20002: 'No action required',
    20003: 'The maximum number of supported processes has been exceeded',
} as const;

export type ErrorCodeMapType = keyof typeof ErrorCodeMap;
