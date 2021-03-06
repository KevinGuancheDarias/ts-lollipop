import { ControllerAdapterUtil } from '../utils/controller-adapter.util';

/**
 * Method denoted with this decorator will be executed for HTTP PUT request matching <i>path</i>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {string} path target path
 * @returns
 * @since 0.1.0
 */
export function Put(path: string) {
    return ControllerAdapterUtil.handleHttpMethodDecorator(path, 'handlePutDecorator', 'Put');
}
