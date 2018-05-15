import { SecurityValidationFunction } from './security-validation-function';
import { ControllerSecurityAdapterConstructor } from '../abstract-controller-security-adapter.module';

/**
 * Options that can be passed to a <i>@Security</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ControllerSecurityDecoratorOptions
 */
export interface ControllerSecurityDecoratorOptions {

    /**
     * If it evaluates to true, will not execute validator defined at module level
     *
     * @type {boolean}
     * @memberof ControllerSecurityDecoratorOptions
     */
    overrideGlobalValidation?: boolean;

    /**
     * Action to execute to follow the authentication
     *
     * @memberof ControllerSecurityDecoratorOptions
     */
    customValidation?: SecurityValidationFunction;

    targetModule?: ControllerSecurityAdapterConstructor;
}
