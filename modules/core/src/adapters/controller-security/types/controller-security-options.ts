import { SecurityValidationFunction } from './security-validation-function';

/**
 * Represents the options that a security module accepts
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface ControllerSecurityOptions
 */
export interface ControllerSecurityOptions {
    /**
     * If true, will check all routes, and not only those having the @Security decorator, defaults to false
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof ControllerSecurityOptions
     */
    checkAll?: boolean;

    /**
     * If true, will return HTTP 400 "Bad Request", when request is not supported, but  security module execution is mandatory <br>
     * Defaults to true
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof ControllerSecurityOptions
     */
    isRequired?: boolean;

    /**
     * Action to execute to validate all request
     *
     * @type {SecurityValidationFunction}
     * @since 0.1.0
     * @memberof ControllerSecurityOptions
     */
    validationAction?: SecurityValidationFunction;

    /**
     * Path to login URL (Will not be secured) If not specified, there will not be excluded url
     *
     * @type {string}
     * @since 0.1.0
     * @memberof ControllerSecurityOptions
     */
    loginUrl?: string;
}
