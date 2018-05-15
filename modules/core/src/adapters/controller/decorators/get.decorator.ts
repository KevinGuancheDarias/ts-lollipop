import { ControllerAdapterUtil } from '../utils/controller-adapter.util';

/**
 * Method denoted with this decorator will be executed for HTTP GET request matching <i>path</i>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {string} path target path
 * @returns
 */
export function Get(path: string) {
    return ControllerAdapterUtil.handleHttpMethodDecorator(path, 'handleGetDecorator', 'Get');
}
