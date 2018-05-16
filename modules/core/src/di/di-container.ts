import { BadInputLollipopError } from '../errors/bad-input-lollipop.error';
import { NoSuchComponentLollipopError } from './errors/no-such-component-lollipop.error';
import { ComponentType } from './types/component-type';
import { findDependencies } from './decorators/inject.decorator';
import { ComponentDependency } from './types/component-dependency';
import { InjectionLollipopError } from './errors/injection-lollipop.error';
import { findPostInjectMetadata, runPostInjectMethod } from './decorators/post-inject.decorator';
import { CircularDependencyError } from './errors/circular-dependency-lollipop.error';
import { Constructor } from '../types/constructor';

/**
 * Stores all the Services
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class DiContainer
 */
export class DiContainer {
    private static readonly DEFAULT_MAX_TREE_COUNT = 2000;
    private _storageByIdentifier: { [key: string]: any } = {};
    private _storageByType: { [key: string]: any } = {};
    private _debugTreeCount = 0;
    private _debugTreeComponents: string[] = [];

    /**
     * Creates an instance of DiContainer.
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {boolean} [_createDependencyDebugTree=false] If true, will try to detect circular dependency injections, and notify it
     * @since 0.1.0
     * @memberof DiContainer
     */
    public constructor(private _createDependencyDebugTree = false, private _maxTreeCount: number = DiContainer.DEFAULT_MAX_TREE_COUNT) {

    }

    /**
     * Adds to debug tree only if DependencyDebugTree is wanted
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} injectionName Name of the current component to inject
     * @returns {number} current injection count, -1 if DependencyDebugTree is disabled
     * @since 0.1.0
     * @memberof DiContainer
     */
    public addToDebugTreeCount(injectionName: string): number {
        let retVal: number;
        if (this._createDependencyDebugTree) {
            this._debugTreeComponents.push(injectionName);
            retVal = ++this._debugTreeCount;
        } else {
            retVal = -1;
        }
        return retVal;
    }

    /**
     * Checks if there is a circular dependency injection
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @throws {CircularDependencyError} When there is a circular dependency injection
     * @since 0.1.0
     * @memberof DiContainer
     */
    public checkDebugTree(): void {
        if (this._debugTreeCount >= this._maxTreeCount) {
            const debugTreeAsString = this._debugTreeComponents.join(' > ');
            throw new CircularDependencyError(`A circular dependency was detected, injection trace: ${debugTreeAsString}`);
        }
    }

    /**
     * Gets a component using its identifier <br>
     * If you want to get by type, use the other call signature (with the class as first argument)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} componentIdentifier ÇomponentIdentifier
     * @returns {*}
     * @throws {BadInputLollipopError} When <i>componentIdentifier</i> is not valid
     * @throws {NoSuchComponentLollipopError} When component was not found in the Container
     * @since 0.1.0
     * @memberof DiContainer
     */
    public getComponent(componentIdentifier: string): any;

    /**
     * Gets a component by type
     * If you want to get by identifier, use the other call signature (with string as first argument)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T class of the component to return
     * @param {Constructor<T>} componentType
     * @returns {T}
     * @throws {BadInputLollipopError} When <i>componentType</i> is not valid
     * @throws {NoSuchComponentLollipopError} When component was not found in the Container
     * @since 0.1.0
     * @memberof DiContainer
     */
    getComponent<T>(componentType: Constructor<T>): T;

    /**
     * Gets a component from the container storage
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T class of the component to return
     * @param {(string | Constructor<T>)} componentNameOrType
     * @returns {T} instance
     * @throws {BadInputLollipopError} When <i>componentNameOrType</i> is not valid
     * @throws {NoSuchComponentLollipopError} When component was not found in the Container
     * @since 0.1.0
     * @memberof Container
     */
    public getComponent<T>(componentNameOrType: string | Constructor<T>): T {
        let instance: any;
        if (typeof componentNameOrType === 'string') {
            instance = this._getComponentByString(componentNameOrType);
        } else if (typeof componentNameOrType === 'function') {
            instance = this._getComponentByType(componentNameOrType);
        } else {
            throw new BadInputLollipopError(`getComponent() expects a string, or a constructor, passed: ${typeof componentNameOrType}`);
        }
        return instance;
    }

    /**
     * Registers a component in the DI container
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {FunctionConstructor} componentConstructor
     * @param {string} [componentIdentifier]
     * @since 0.1.0
     * @memberof DiContainer
     */
    public registerComponent(componentConstructor: FunctionConstructor, componentIdentifier?: string): void;

    /**
     * Registers a component in the DI container
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {ComponentType} component
     * @since 0.1.0
     * @memberof DiContainer
     */
    public registerComponent(component: ComponentType);

    /**
     * Registers a component in the DI container
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {FunctionConstructor|ComponentType} componentConstructor constructor function, or component type
     * @param {string} [componentIdentifier]
     * @since 0.1.0
     * @memberof DiContainer
     */
    public registerComponent(componentConstructor: FunctionConstructor | ComponentType, componentIdentifier?: string): void {
        let targetComponent: ComponentType;
        if (typeof componentConstructor === 'function') {
            targetComponent = {
                constructor: componentConstructor,
                identifier: componentIdentifier
            };
        } else {
            targetComponent = componentConstructor;
        }
        const instance = new targetComponent.constructor();
        this.registerInstancedComponent(instance, componentIdentifier);
    }

    /**
     * Registers a component that has database
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {*} instance Instance of component
     * @param {string} [identifier] target component identifier
     * @since 0.1.0
     * @memberof DiContainer
     */
    public registerInstancedComponent(instance: any, identifier?: string) {
        const targetComponent: ComponentType = {
            constructor: instance.constructor,
            identifier
        };
        const constructorName: string = targetComponent.constructor.name;
        if (targetComponent.identifier) {
            this._storageByIdentifier[targetComponent.identifier] = instance;
        } else {
            this._storageByType[constructorName] = instance;
        }
    }

    /**
     * Injects the dependencies into the target object
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Function} target
     * @since 0.1.0
     * @memberof DiContainer
     */
    public injectInto(target: Function): void {
        findDependencies(target).forEach(dependency => {
            target[dependency.targetProperty] = this._resolveDependency(dependency, target);
        });
    }

    /**
     * After all the components, has been registered, we are going to inject all the components with @Inject decorator
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>} resolves, when all the dependencies has been injected
     * @since 0.1.0
     * @memberof DiContainer
     */
    public injectAllDependencies(): void {
        const doInject = storage => {
            for (const property in storage) {
                if (storage.hasOwnProperty(property)) {
                    this.injectInto(storage[property]);
                }
            }
        };

        doInject(this._storageByIdentifier);
        doInject(this._storageByType);
    }

    /**
     * Executes all the methods with PostInject decorator
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>} Resolves when all the post inject methods have been executed
     * @since 0.1.0
     * @memberof DiContainer
     */
    public async triggerPostInject(): Promise<void> {
        const doTrigger = async storage => {
            for (const instanceIndex in storage) {
                if (storage.hasOwnProperty(instanceIndex)) {
                    const target = storage[instanceIndex];
                    const metadata = findPostInjectMetadata(target);
                    if (metadata) {
                        await runPostInjectMethod(target, this);
                    }
                }
            }
        };
        await doTrigger(this._storageByIdentifier);
        await doTrigger(this._storageByType);
    }

    private _getComponentByString(registeredName: string): any {
        const instance = this._storageByIdentifier[registeredName];
        if (!instance) {
            throw new NoSuchComponentLollipopError(`No component with identifier ${registeredName}`);
        }
        return instance;
    }

    private _getComponentByType(componentType: Function) {
        const type: string = componentType.name;
        const instance = this._storageByType[type];
        if (!instance) {
            throw new NoSuchComponentLollipopError(`No component of type ${type} was found`);
        }
        return instance;
    }

    /**
     * Resolves the input dependency returning the <b>stored instance</b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @param {ComponentDependency} dependency Input dependency
     * @param {Function} target object that needs this dependency
     * @returns {*} resolved instance
     * @throws {InjectionLollipopError} When the component couldn't be found in the Container's storage
     * @since 0.1.0
     * @memberof DiContainer
     */
    private _resolveDependency(dependency: ComponentDependency, target: Function): any {
        let instance;
        if (dependency.identifier) {
            instance = this._storageByIdentifier[dependency.identifier];
            if (!instance) {
                throw new InjectionLollipopError(
                    `No component with identifier ${dependency.identifier} was found, when trying to inject into ${target.constructor.name}`
                );
            }
        } else {
            instance = this._storageByType[dependency.constructor.name];
            if (!instance) {
                throw new InjectionLollipopError(
                    `No component of type ${dependency.constructor.name} was found, when trying to inject into ${target.constructor.name}`
                );
            }
        }
        return instance;
    }

}
