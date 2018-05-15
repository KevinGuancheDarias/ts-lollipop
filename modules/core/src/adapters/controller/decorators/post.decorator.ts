import { ControllerAdapterUtil } from '../utils/controller-adapter.util';

/**
 * Method denoted with this decorator will be executed for HTTP Post request matching <i>path</i>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {string} path target path
 * @returns
 */
export function Post(path: string) {
    return ControllerAdapterUtil.handleHttpMethodDecorator(path, 'handlePostDecorator', 'Post');
}
