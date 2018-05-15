import { LollipopError } from './lollipop.error';

/**
 * Thrown when a function is invoked, unexpectdly, for example ContextHolder.registerHook is executed after Lollipop.init()
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LifeCycleLollipopError
 * @extends {LollipopError}
 */
export class LifeCycleLollipopError extends LollipopError {

}
