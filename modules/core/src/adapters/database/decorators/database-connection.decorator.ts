import { Inject } from '../../../di/decorators/inject.decorator';
import { ContextHolder } from '../../../context-holder';
import { FrameworkHooksEnum } from '../../../hook/enums/framework-hooks.enum';
import { ControllerAdapterUtil } from '../../controller/utils/controller-adapter.util';

/** @since 0.1.0 */
export const LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER = 'LollipopDatabaseConnection';

/**
 * Injects the connection into the specified property
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @returns {PropertyDecorator}
 * @since 0.1.0
 */
export function DatabaseConnection(): PropertyDecorator {
    const injectFunction: PropertyDecorator = Inject(LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER);
    return (target, targetProperty) => {
        injectFunction(target, targetProperty);
        ContextHolder.registerHooks({
            type: FrameworkHooksEnum.CONTROLLERS_READY,
            name: '@DatabaseConnection check if input is a @Controller',
            body: () => {
                if (ControllerAdapterUtil.isController(target.constructor)) {
                    console.warn(
                        // tslint:disable-next-line:max-line-length
                        `Please do NOT use database operations in the controller, may work, but is forbbiden for organization reasons, controller is ${target.constructor.name} `
                    );
                }
            }
        });
    };
}
