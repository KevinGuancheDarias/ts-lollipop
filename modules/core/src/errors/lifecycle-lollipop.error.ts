import { LollipopError } from './lollipop.error';

/**
 * Thrown when a function is invoked, unexpectdly, for example ContextHolder.registerHook is executed after Lollipop.init()
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LifeCycleLollipopError
 * @since 0.1.0
 * @extends {LollipopError}
 */
export class LifeCycleLollipopError extends LollipopError {

}
