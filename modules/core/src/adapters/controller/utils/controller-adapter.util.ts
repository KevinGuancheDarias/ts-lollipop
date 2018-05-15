
import { ContextHolder } from '../../../context-holder';
import { AbstractControllerAdapterModule } from '../abstract-controller-adapter.module';
import { ModuleTypes } from '../../../enums/module-types.enum';
import { findControllerPrefix } from '../decorators/controller.decorator';
import { BadInputLollipopError } from '../../../errors/bad-input-lollipop.error';
import { FrameworkHooksEnum } from '../../../hook/enums/framework-hooks.enum';

/**
 * Has tools to help creating ControllerAdapters
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ControllerAdapterUtil
 */
export class ControllerAdapterUtil {

    /**
     * Returns the list of registered modules that are of type ControllerAdapterModule
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @returns {AbstractControllerAdapterModule[]}
     * @memberof ControllerAdapterUtil
     */
    public static getRegisteredControllers(): AbstractControllerAdapterModule[] {
        return ContextHolder.getLollipop().getRegisteredModulesByType<AbstractControllerAdapterModule>(ModuleTypes.CONTROLLER);
    }

    /**
     * Helper to avoid repeating code when creating HTTP methods, method decorators
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} path Target URI
     * @param {keyof AbstractControllerAdapterModule} handlerMethod Method used to handle the decorator
     * @param {string} decoratorName Involved decorator
     * @returns {MethodDecorator} decorator body
     * @memberof ControllerAdapterUtil
     */
    public static handleHttpMethodDecorator(
        path: string,
        handlerMethod: keyof AbstractControllerAdapterModule,
        decoratorName: string
    ): MethodDecorator {

        return (target, method) => {
            ContextHolder.registerHooks({
                type: FrameworkHooksEnum.CONTROLLERS_AFTER_SCAN,
                body: () => {
                    if (typeof method === 'string') {
                        ControllerAdapterUtil.checkValidRoutePath(path, target, method, decoratorName);
                        let controllerPrefix: string = findControllerPrefix(target.constructor);
                        if (!controllerPrefix) {
                            throw new BadInputLollipopError(
                                `Can NOT use @${decoratorName} because class must have @Controller, at ${target}.${method}`
                            );
                        } else if (controllerPrefix === '/') {
                            controllerPrefix = '';
                        }
                        ControllerAdapterUtil.getRegisteredControllers().forEach(current => {
                            current.registerController(target);
                            current[handlerMethod].apply(current, [`${controllerPrefix}/${path}`, target, method]);
                        });
                    }
                }
            });
        };
    }

    /**
     * Checks if the path is not empty
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} path path to test
     * @param {Function} target Decorated class
     * @param {string} decoratorName Decorator name
     * @throws {BadInputLollipopError} When path is empty
     * @memberof ControllerAdapterUtil
     */
    public static checkNotEmptyPath(path: string, target: Function, decoratorName: string): void {
        if (!path.length) {
            throw new BadInputLollipopError(
                `Path CAN'T be empty in @${decoratorName} at class ${target.name}`
            );
        }
    }

    /**
     * Checks if the path is valid to be used as prefix
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} path target path to use as prefix
     * @param {Function} target Class that is decorated
     * @param {string} [decoratorName='Controller'] Name of the decorator involved
     * @throws {BadInputLollipopError} When prefix is not valid
     * @memberof ControllerAdapterUtil
     */
    public static checkValidPathPrefix(path: string, target: Function, decoratorName = 'Controller'): void {
        ControllerAdapterUtil.checkNotEmptyPath(path, target, decoratorName);
        if (path !== '/' && (!path.startsWith('/') || path.endsWith('/'))) {
            throw new BadInputLollipopError(
                // tslint:disable-next-line:max-line-length
                `Bad value for prefix in @${decoratorName} at class ${target.name} MUST start with a slash and cant end with slash, passed ${path}`
            );
        } else if (!/^[a-zA-Z0-9-_\s\/]+$/.test(path)) {
            throw new BadInputLollipopError(
                // tslint:disable-next-line:max-line-length
                `Bad value for path in @${decoratorName} at class ${target.constructor.name}, path can only have alphanumeric characters, dash, underscore, color is NOT supported in prefix path`
            );
        }
    }

    /**
     * Checks if the path for the given route is valid
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} path target path, empty is accepted
     * @param {Object} target instance of the controller
     * @param {string} decoratorName name of the involved decorator
     * @throws {BadInputLollipopError} When path is not valid
     * @memberof ControllerAdapterUtil
     */
    public static checkValidRoutePath(path: string, target: Object, methodName: string, decoratorName: string): void {
        if (!path.length) {
            return;
        }
        if (path.startsWith('/') || path.endsWith('/')) {
            throw new BadInputLollipopError(
                // tslint:disable-next-line:max-line-length
                `Bad value for path in @${decoratorName} at class ${target.constructor.name}.${methodName}() CAN'T start or end with a slash, passed ${path}`
            );
        } else if (!/^[a-zA-Z0-9-_\s\/:]+$/.test(path)) {
            throw new BadInputLollipopError(
                // tslint:disable-next-line:max-line-length
                `Bad value for path in @${decoratorName} at class ${target.constructor.name}.${methodName}(), path can only have alphanumeric characters, dash, underscore and colon`
            );
        }
    }

    /**
     * Detects if the input is a controller (so checks, if it has the @Controller decorator)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {FunctionConstructor} target Tested class
     * @returns {boolean} True if <i>target</i> has @Controller decorator
     * @memberof ControllerAdapterUtil
     */
    public static isController(target: Function): boolean {
        return typeof findControllerPrefix(target) === 'string';
    }

    private constructor() {
        // It's an util class
    }
}
