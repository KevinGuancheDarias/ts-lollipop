import { RouteConfig } from '../types/route-config';
import { ControllerAdapterUtil } from '../utils/controller-adapter.util';

/**
 * Put it to methods that handle HTTP request
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {RouteConfig} routeConfig Configuration
 * @returns {MethodDecorator}
 */
export function Route(routeConfig: RouteConfig): MethodDecorator {
    return (target, method) => {
        if (typeof method === 'string') {
            ControllerAdapterUtil.checkValidRoutePath(routeConfig.path, target, method, 'Route');
            ControllerAdapterUtil.getRegisteredControllers().forEach(current => current.handleRouteDecorator(routeConfig, target, method));
        }
    };
}
