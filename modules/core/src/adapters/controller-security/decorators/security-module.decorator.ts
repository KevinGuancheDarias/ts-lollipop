import { ControllerSecurityAdapterConstructor } from '../abstract-controller-security-adapter.module';
import { ContextHolder } from '../../../context-holder';
import { FrameworkHooksEnum } from '../../../hook/enums/framework-hooks.enum';
import { ControllerAdapterUtil } from '../../controller/utils/controller-adapter.util';
import { ModuleNotFoundLollipopError } from '../../../errors/module-not-found-lollipop.error';
import { BadInputLollipopError } from '../../../errors/bad-input-lollipop.error';

export function SecurityModule(specificModule?: ControllerSecurityAdapterConstructor): PropertyDecorator {
    return (target, prop) => {
        ContextHolder.registerHooks({
            type: FrameworkHooksEnum.CONTROLLERS_READY,
            name: '@SecurityModule injection',
            body: () => {
                let securityModule;
                ControllerAdapterUtil.getRegisteredControllers().forEach(currentController => {
                    const modules = currentController.getSecurityModules();
                    if (specificModule) {
                        securityModule = modules.find(current => current.constructor === specificModule);
                        if (!securityModule) {
                            throw new ModuleNotFoundLollipopError(
                                `No security module found in @SecurityModule at ${target}.${prop}`
                            );
                        }

                    } else if (modules.length > 1) {
                        throw new BadInputLollipopError(
                            // tslint:disable-next-line:max-line-length
                            `Can NOT use @SecurityModule without specific security module, when more than one security module is registered, at ${target}.${prop}`
                        );
                    } else {
                        securityModule = modules[0];
                    }
                });
                target[prop] = securityModule;
            }
        });
        return Object.defineProperty(target, prop, { writable: true });
    };
}
