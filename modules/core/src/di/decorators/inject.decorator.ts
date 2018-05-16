import 'reflect-metadata';

import { ComponentDependency } from '../types/component-dependency';
import { InjectionLollipopError } from '../errors/injection-lollipop.error';

const INJECT_METADATA_PROPERTY = 'Inject';

/**
 * Appends a dependency to the metadata
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @param {*} target Class that has Inject decorators
 * @param {ComponentDependency} dependency Dependency to append
 */
function _appendDependenciesMetadata(target: Function | Object, dependency: ComponentDependency): void {
    let currentDependencies: ComponentDependency[] = findDependencies(target);
    if (currentDependencies instanceof Array) {
        currentDependencies.push(dependency);
    } else {
        currentDependencies = [dependency];
    }
    Reflect.defineMetadata(INJECT_METADATA_PROPERTY, currentDependencies, target);
    if (typeof target === 'object') {
        Reflect.defineMetadata(INJECT_METADATA_PROPERTY, currentDependencies, target.constructor);
    }
}

/**
 * Finds the dependencies for the giving class
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {Function|Object} target Target instance
 * @returns {ComponentDependency[]} An array of dependencies
 */
export function findDependencies(target: Object | Function): ComponentDependency[] {
    return Reflect.getMetadata(INJECT_METADATA_PROPERTY, target) || [];
}

export function Inject(identifierOrType?: string | Function): PropertyDecorator {
    return (target: any, targetProperty: string | symbol) => {
        if (typeof targetProperty === 'string') {
            let targetStorage = identifierOrType;
            if (!targetStorage) {
                targetStorage = Reflect.getMetadata('design:type', target, targetProperty);
                if (typeof targetStorage !== 'function') {
                    throw new InjectionLollipopError(`Could not detect type for ${target.targetProperty}, you can specify type manually`);
                }
            }
            _appendDependenciesMetadata(target, {
                constructor: typeof targetStorage === 'function'
                    ? targetStorage
                    : target,
                identifier: typeof targetStorage === 'string'
                    ? targetStorage
                    : undefined,
                targetProperty
            });
        }
        return Object.defineProperty(target, targetProperty, { writable: true });
    };

}
