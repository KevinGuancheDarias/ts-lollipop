import { AbstractControllerSecurityAdapter } from '../abstract-controller-security-adapter.module';
import { RequestFilter, EMPTY_REQUEST_FILTER } from '../../controller/types/request-filter';
import { ContextHolder } from '../../../context-holder';
import { ModuleTypes } from '../../../enums/module-types.enum';
import { ModuleNotFoundLollipopError } from '../../../errors/module-not-found-lollipop.error';
import { AbstractControllerAdapterModule } from '../../controller/abstract-controller-adapter.module';

/**
 * Has method to help interacting with ControllerSecurityAdapters
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ControllerSecurityAdapterUtil
 */
export class ControllerSecurityAdapterUtil {

    /**
     * Detects and prepends the security filter to the request filter chain
     * Will search in the metainformation the security
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @template T
     * @param {T} target Target instance that has the method (Usually an instance of a class decorated with @Controller)
     * @param {keyof T} targetMethod Target method to check for custom security
     * @param {AbstractControllerSecurityAdapter} securityModule Module to use, if not defined, will use first one
     * @returns {RequestFilter}
     * @throws {ModuleNotFoundLollipopError} When <i>securityModule</i> is specified, but the specified one is not registered
     * @memberof SecurityAdapterUtil
     */
    public static handleSecurityForMethod<T>(
        target: T,
        targetMethod: keyof T,
        securityModule?: AbstractControllerSecurityAdapter
    ): RequestFilter {
        const targetModule: AbstractControllerSecurityAdapter = (
            ControllerSecurityAdapterUtil._findTargetSecurityModule(target, targetMethod, securityModule)
        );
        return targetModule
            ? targetModule.findMethodSecurityFilter(target, targetMethod)
            : EMPTY_REQUEST_FILTER;

    }

    private static _findTargetSecurityModule<T>(
        target: T,
        targetMethod: keyof T,
        specifiedSecurityModule: AbstractControllerSecurityAdapter
    ): AbstractControllerSecurityAdapter {
        const securityModules: AbstractControllerSecurityAdapter[] = ContextHolder
            .getLollipop()
            .getRegisteredModuleByType<AbstractControllerAdapterModule>(ModuleTypes.CONTROLLER).getSecurityModules();
        let targetModule: AbstractControllerSecurityAdapter;
        if (specifiedSecurityModule) {
            targetModule = securityModules.find(current => current.constructor === specifiedSecurityModule.constructor);
            if (!targetModule) {
                throw new ModuleNotFoundLollipopError(
                    // tslint:disable-next-line:max-line-length
                    `No security module of type ${specifiedSecurityModule.constructor.name} for @Security in ${target.constructor.name}.${targetMethod}`
                );
            }
        } else {
            targetModule = securityModules[0];
            if (!targetModule) {
                console.warn('Warning security will not work, as there is not any security module registered');
            } else if (securityModules.length > 1) {
                console.warn(
                    // tslint:disable-next-line:max-line-length
                    `More than one security module exists, but no specific one was selected, will use first registered (${targetModule.constructor.name}) for @Security in ${target.constructor.name}.${targetMethod}`
                );
            }
        }
        return targetModule || null;
    }
}
