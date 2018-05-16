import { ControllerSecurityDecoratorOptions } from '../types/controller-security-decorator-options';

const SECURITY_METADATA_PROPERTY = 'LollipopSecurity';

/**
 * Returns the information of <i>@Security</i> decorator, if not decorator is found will return null
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {*} target
 * @param {*} [method]
 * @returns {ControllerSecurityDecoratorOptions} Information or null
 * @since 0.1.0
 */
export function findSecurityDecoratorMetadata(target: any, method?: any): ControllerSecurityDecoratorOptions {
    let retVal: ControllerSecurityDecoratorOptions;
    if (method) {
        let metadata: ControllerSecurityDecoratorOptions = Reflect.getMetadata(SECURITY_METADATA_PROPERTY, target, method);
        if (!metadata) {
            metadata = Reflect.getMetadata(SECURITY_METADATA_PROPERTY, target.constructor);
        }
        retVal = metadata;
    } else {
        retVal = Reflect.getMetadata(SECURITY_METADATA_PROPERTY, target.constructor);
    }
    return retVal || null;
}

/**
 * Detects, if should exclude target method from security <br>
 * Will exclude when: <br>
 * <ul>
 * <li> Method has @Security.excludeMethod() decorator </li>
 * <li> Method does NOT have @Security.forMethod() and class has @Security.excludeClass()
 * </ul>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {*} target
 * @param {*} method
 * @returns {boolean}
 * @since 0.1.0
 */
export function isExcluded(target: any, method: any): boolean {
    const metadata = Reflect.getMetadata(SECURITY_METADATA_PROPERTY, target, method);
    let retVal = metadata && metadata.excluded;
    if (!retVal) {
        const classMetadata = Reflect.getMetadata(SECURITY_METADATA_PROPERTY, target.constructor);
        retVal = classMetadata && classMetadata.excluded && !metadata;
    }
    return retVal;
}

export namespace Security {
    /**
     * Applies Security for given class
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @export
     * @param {ControllerSecurityDecoratorOptions} [options]
     * @returns {ClassDecorator}
     * @since 0.1.0
     */
    export function forClass(options?: ControllerSecurityDecoratorOptions): ClassDecorator {
        return target => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, options || {}, target);
        };
    }

    /**
     * Applies security for given method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @export
     * @param {ControllerSecurityDecoratorOptions} [options]
     * @returns {MethodDecorator}
     * @since 0.1.0
     */
    export function forMethod(options?: ControllerSecurityDecoratorOptions): MethodDecorator {
        return (target, method) => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, options || {}, target, method);
        };
    }

    /**
     * Excludes a class from the security <br>
     * Useful when module is configured to secure all controllers by default
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @export
     * @returns {ClassDecorator}
     * @since 0.1.0
     */
    export function excludeClass(): ClassDecorator {
        return target => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, { excluded: true }, target);
        };
    }
    /**
     * Excludes a method from the security <br>
     * Useful when class has @Security decorator
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @export
     * @returns {MethodDecorator}
     * @since 0.1.0
     */
    export function excludeMethod(): MethodDecorator {
        return (target, method) => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, { excluded: true }, target, method);
        };
    }
}
