import 'reflect-metadata';

import { ComponentType } from '../types/component-type';

const COMPONENT_METADATA_PROPERTY = 'Component';

/**
 * Detects the information passed by the <i>Component</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {*} target
 * @returns {ComponentType} undefined, if the class has not that decorator
 * @since 0.1.0
 */
export function _findComponentMetadata(target: any): ComponentType {
    return Reflect.getMetadata(COMPONENT_METADATA_PROPERTY, target);
}

/**
 * Decorates a component in a way it can be detected by DiModule
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {any} target Class object
 * @param {string} [identifier] If specified, will be used to represent the CI object
 * @returns {ClassDecorator}
 * @since 0.1.0
 */
export function Component(identifier?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(COMPONENT_METADATA_PROPERTY, {
            constructor: target,
            identifier
        } as ComponentType, target);
        return target;
    };
}
