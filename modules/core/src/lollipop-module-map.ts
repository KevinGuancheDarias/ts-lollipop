import { LollipopModuleConstructor, AbstractLollipopModule } from './abstract-lollipop-module';

/**
 * Represents a map of LollipopModules, indexed by string (name of the constructor)
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LollipopModuleMap
 */
export class LollipopModulesContainer {
    private _modulesMap: { [key: string]: AbstractLollipopModule } = {};

    /**
     * Adds a new module to the map
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {AbstractLollipopModule} module instance of the module
     * @returns {this} self
     * @memberof LollipopModulesContainer
     */
    public add(module: AbstractLollipopModule): this {
        this._modulesMap[module.constructor.name] = module;
        return this;
    }

    /**
     * Returns a copy of the modules map
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {{[ key: string]: AbstractLollipopModule}} copy of the modules map
     * @memberof LollipopModulesContainer
     */
    public getModulesMap(): { [key: string]: AbstractLollipopModule } {
        return { ...this._modulesMap };
    }

    /**
     * Returns the entire modules map as an array of modules
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {AbstractLollipopModule[]} List of registered modules
     * @memberof LollipopModulesContainer
     */
    public getModulesMapAsValuesArray(): AbstractLollipopModule[] {
        const modulesMap = this.getModulesMap();
        const retVal: AbstractLollipopModule[] = [];
        for (const moduleIndex in modulesMap) {
            if (modulesMap.hasOwnProperty(moduleIndex)) {
                retVal.push(modulesMap[moduleIndex]);
            }
        }
        return retVal;
    }

    public isModuleInMap(module: AbstractLollipopModule | LollipopModuleConstructor): boolean {
        const name = (module instanceof AbstractLollipopModule)
            ? module.constructor.name
            : module.name;
        return !!this._modulesMap[name];
    }
};
