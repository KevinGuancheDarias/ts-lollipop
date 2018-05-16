import { ComponentType } from './component-type';
import { Constructor } from '../../types/constructor';

/**
 * Represents a <i>ComponentType</i> that is going to be injected in <i>targetProperty</i> of Metadata's target object
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ComponentDependency
 * @since 0.1.0
 * @extends {ComponentType}
 */
export interface ComponentDependency<T extends Constructor<T>  = any> extends ComponentType<T> {
    targetProperty: keyof T;
}
