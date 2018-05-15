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
    export function forClass(options?: ControllerSecurityDecoratorOptions): ClassDecorator {
        return target => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, options || {}, target);
        };
    }
    export function forMethod(options?: ControllerSecurityDecoratorOptions): MethodDecorator {
        return (target, method) => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, options || {}, target, method);
        };
    }

    export function excludeClass(): ClassDecorator {
        return target => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, { excluded: true }, target);
        };
    }
    /**
     * Excludes a method from the security, useful when class has @Security decorator
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @export
     * @returns {MethodDecorator}
     */
    export function excludeMethod(): MethodDecorator {
        return (target, method) => {
            Reflect.defineMetadata(SECURITY_METADATA_PROPERTY, { excluded: true }, target, method);
        };
    }
}
