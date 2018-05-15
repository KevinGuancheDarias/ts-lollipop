import { ComponentType } from './component-type';

/**
 * Represents a <i>ComponentType</i> that is going to be injected in <i>targetProperty</i> of Metadata's target object
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ComponentDependency
 * @extends {ComponentType}
 */
export interface ComponentDependency extends ComponentType {
    targetProperty;
}
