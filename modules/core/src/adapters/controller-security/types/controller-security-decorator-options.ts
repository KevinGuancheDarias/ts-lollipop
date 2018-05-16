import { SecurityValidationFunction } from './security-validation-function';
import { ControllerSecurityAdapterConstructor } from '../abstract-controller-security-adapter.module';

/**
 * Options that can be passed to a <i>@Security</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface ControllerSecurityDecoratorOptions
 */
export interface ControllerSecurityDecoratorOptions {

    /**
     * If it evaluates to true, will not execute validator defined at module level
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof ControllerSecurityDecoratorOptions
     */
    overrideGlobalValidation?: boolean;

    /**
     * Action to execute to follow the authentication
     *
     * @since 0.1.0
     * @memberof ControllerSecurityDecoratorOptions
     */
    customValidation?: SecurityValidationFunction;

    /**
     * Security module to use (if none is defined will use all registered security modules)
     *
     * @type {ControllerSecurityAdapterConstructor}
     * @since 0.1.0
     * @memberof ControllerSecurityDecoratorOptions
     */
    targetModule?: ControllerSecurityAdapterConstructor;
}
