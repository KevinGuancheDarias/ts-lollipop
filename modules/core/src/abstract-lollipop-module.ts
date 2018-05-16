import { ModuleTypes } from './enums/module-types.enum';

/**
 * Forces class to be an instanceof AbstractLollipopModule
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface LollipopModuleConstructor
 */
export interface LollipopModuleConstructor {
    new(): AbstractLollipopModule;
}

/**
 * Modules wishing to register, MUST extend this interface
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LollipopModule
 * @since 0.1.0
 * @extends {LollipopModuleConstructor}
 */
export abstract class AbstractLollipopModule {

    /**
     * Returns the type of the module
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @returns {ModuleTypes}
     * @since 0.1.0
     * @memberof AbstractLollipopModule
     */
    public abstract getModuleType(): ModuleTypes;

    /**
     * Executes the action required to register a LollipopModule <br>
     * Typically a module would add Hooks to <i>ContextHolder</i> in this method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {any} config Module configuration
     * @returns {Promise<void>} Resolves when the module is ready
     * @since 0.1.0
     * @memberof LollipopModule
     */
    public abstract registerModule(config?: any): Promise<void>;
}
