import 'reflect-metadata';

import { ControllerAdapterUtil } from '../utils/controller-adapter.util';
import { ContextHolder } from '../../../context-holder';
import { FrameworkHooksEnum } from '../../../hook/enums/framework-hooks.enum';

const CONTROLLER_METADATA_PROPERTY = 'Controller';

/**
 * Returns the prefix passed to <i>@Controller</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {Function} target Target object constructor
 * @returns {string}
 * @since 0.1.0
 */
export function findControllerPrefix(target: Function): string {
    return Reflect.getMetadata(CONTROLLER_METADATA_PROPERTY, target);
}

/**
 * Creates an HTTP Controller
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {string} [prefix=/] Prefix to preprend to all routes found in this object
 * @returns {ClassDecorator}
 * @since 0.1.0
 */
export function Controller(prefix = '/'): ClassDecorator {
    return target => {
        ControllerAdapterUtil.checkValidPathPrefix(prefix, target);
        Reflect.defineMetadata(CONTROLLER_METADATA_PROPERTY, prefix, target);
        ContextHolder.registerHooks({
            type: FrameworkHooksEnum.CONTROLLERS_AFTER_SCAN,
            body: () => ControllerAdapterUtil.getRegisteredControllers().forEach(current => current.handleControllerDecorator(target))
        });
    };
}
