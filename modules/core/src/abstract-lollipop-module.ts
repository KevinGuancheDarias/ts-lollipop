import { ModuleTypes } from './enums/module-types.enum';

export interface LollipopModuleConstructor {
    new(): AbstractLollipopModule;
}

/**
 * Modules wishing to register, MUST extend this interface
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LollipopModule
 * @extends {LollipopModuleConstructor}
 */
export abstract class AbstractLollipopModule {

    public abstract getModuleType(): ModuleTypes;

    /**
     * Executes the action required to register a LollipopModule <br>
     * Typically a module would add Hooks to <i>ContextHolder</i> in this method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {any} config Module configuration
     * @returns {Promise<void>} Resolves when the module is ready
     * @memberof LollipopModule
     */
    public abstract registerModule(config?: any): Promise<void>;
}
