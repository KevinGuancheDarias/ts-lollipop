import 'reflect-metadata';

import { BadInputLollipopError } from '../../errors/bad-input-lollipop.error';
import { DuplicatedDecoratorLollipopError } from '../../errors/duplicated-decorator-lollipop';
import { LifeCycleLollipopError } from '../../errors/lifecycle-lollipop.error';
import { ProgrammingLollipopError } from '../../errors/programming-lollipop.error';
import { ConfigurationHolder } from '../../config/configuration.holder';
import { LollipopLogger } from '../../log/lollipop-logger';
import { findDependencies } from './inject.decorator';
import { DiContainer } from '../di-container';

const POST_CONSTRUCT_METADATA_PROPERTY = 'PostInject';

/**
 * Stores the metadata
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @param {Object} target
 * @param {PostInjectMetadata} metadata
 */
function _storeMetadata(target: Object, metadata: PostInjectMetadata): void {
    Reflect.defineMetadata(POST_CONSTRUCT_METADATA_PROPERTY, metadata, target);
}

async function _waitForDependenciesExecution(target: Object, container: DiContainer): Promise<void> {
    await Promise.all(
        findDependencies(target).map(async current => {
            const instance = container.getComponent(current.identifier || current.constructor);
            const metadata: PostInjectMetadata = findPostInjectMetadata(instance);
            if (metadata) {
                const methodPromise: Promise<any> = metadata.executionPromise
                    ? metadata.executionPromise
                    : runPostInjectMethod(instance, container);
                await methodPromise;
            }
        })
    );
}

/**
 * Represents the stored metadata of the PostInject decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface PostInjectMetadata
 */
export interface PostInjectMetadata {

    /**
     * Name of the method that has the PostInject decorator
     *
     * @type {string}
     * @memberof PostInjectMetadata
     */
    methodName: string;

    /**
     * Has the promise returned from the execution of the method, if the method returns no Promise, has a resolved void promise
     *
     * @type {Promise<any>}
     * @memberof PostInjectMetadata
     */
    executionPromise?: Promise<any>;
}

/**
 * Returns the metadata of the PostInject decoratored class
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {Object} target Object to lookup for <i>PostInject</i> decorator
 * @returns {string} null if method has not <i>PostInject</i> decorator
 */
export function findPostInjectMetadata(target: Object): PostInjectMetadata {
    return Reflect.getMetadata(POST_CONSTRUCT_METADATA_PROPERTY, target) || null;
}

/**
 * Executes the method decorated with PostInject
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {Object} target Object to run
 * @param {DiContainer} container Container required to get components
 * @returns {Promise<void>} Resolves when the postInject method is resolved
 */
export async function runPostInjectMethod(target: Object, container: DiContainer): Promise<void> {
    const metadata: PostInjectMetadata = findPostInjectMetadata(target);
    if (!metadata) {
        throw new LifeCycleLollipopError('Can\'t run PostInject method, of an object that has not PostInject decorator');
    }
    container.addToDebugTreeCount(target.constructor.name);
    container.checkDebugTree();
    await ConfigurationHolder.isReady;
    const log: LollipopLogger = new LollipopLogger(PostInject);
    log.debug(`Running post inject method for object ${target.constructor.name}`);
    await _waitForDependenciesExecution(target, container);
    if (metadata.executionPromise) {
        log.debug('executionPromis Already defined, will await if required');
        await metadata.executionPromise;
    } else {
        log.debug('PostInject method was not invoked, invoking it');
        let retVal: Promise<any> = target[metadata.methodName].apply(target);
        if (!(retVal instanceof Promise)) {
            retVal = Promise.resolve();
        }
        metadata.executionPromise = retVal;
        _storeMetadata(target, metadata);
        await retVal;
    }
}

/**
 * Action to execute when all @Injects has been injected
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @returns {MethodDecorator}
 * @throws {BadInputLollipopError} If target is not a method
 * @throws {DuplicatedDecoratorLollipopError} If more than one PostInject annotation has been defined in the object
 */
export function PostInject(): MethodDecorator {
    return (target, methodName) => {
        if (typeof methodName === 'string') {
            if (typeof target[methodName] !== 'function') {
                throw new BadInputLollipopError(
                    `PostInject, expects a method, tried to invoke ${target.constructor.name}.${methodName} as method`
                );
            }
            if (findPostInjectMetadata(target)) {
                throw DuplicatedDecoratorLollipopError.fromDecorator('PostInject');
            }

            _storeMetadata(target, { methodName });
        } else {
            throw new ProgrammingLollipopError('Unexpected symbol for PostInject methodName');
        }
    };
}
