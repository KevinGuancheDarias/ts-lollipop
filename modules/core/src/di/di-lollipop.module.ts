import 'reflect-metadata';

import { AbstractLollipopModule } from '../abstract-lollipop-module';
import { DiContainer } from './di-container';
import { ConfigurationHolder } from '../config/configuration.holder';
import { Configuration } from '../config/types/configuration';
import { ComponentType } from './types/component-type';
import { LollipopLogger } from '../log/lollipop-logger';
import { ProgrammingLollipopError } from '../errors/programming-lollipop.error';
import { _findComponentMetadata } from './decorators/component.decorator';
import { ModuleTypes } from '../enums/module-types.enum';
import { MetadataUtil } from '../utils/metadata.util';
import { Constructor } from '../types/constructor';

export class DiLollipopModule extends AbstractLollipopModule {
    private _settings: Configuration;
    private _diContainer: DiContainer;
    private _log: LollipopLogger;

    public getModuleType(): ModuleTypes {
        return ModuleTypes.DI;
    }

    public async registerModule(): Promise<void> {
        this._settings = await ConfigurationHolder.getConfiguration();
        this._log = new LollipopLogger(DiLollipopModule);
        await this._log.debug('Registering module DiLollipopModule');
        this._diContainer = new DiContainer(this._settings.createDependencyTree, this._settings.dependencyTryMaxCount);
    }

    /**
     * Returns the container instance
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {DiContainer}
     * @memberof DiLollipopModule
     */
    public getContainer(): DiContainer {
        return this._diContainer;
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
     * @memberof DiContainer
     */
    public getComponent<T>(componentType: Constructor<T>): T;

    /**
     * Gets a component from the container storage
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T class of the component to returnGuanche Darias <kevin@kevinguanchedarias.com>
     * @param {(string | Constructor<T>)} componentNameOrType
     * @returns {T}
     * @throws {BadInputLollipopError} When <i>componentNameOrType</i> is not valid
     * @throws {NoSuchComponentLollipopError} When component was not found in the Container
     * @memberof DiLollipopModule
     */
    public getComponent<T>(componentNameOrType: string | Constructor<T>): T {
        return this._diContainer.getComponent<T>(<any>componentNameOrType);
    }

    /**
     * Searches the components in the expected folder
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @memberof Container
     */
    public async findAndRegisterComponents(): Promise<void> {
        const files: string[] = await MetadataUtil.findAllTypescriptSourceFiles([this._settings.basePath]);
        const results: ComponentType[] = [];
        await this._log.debug(`Will register components from ${files.length} files `);
        files.forEach(currentFile => this._parseModule(require(currentFile), results));
        results.forEach(currentComponent => this._diContainer.registerComponent(currentComponent));
    }

    private _parseModule(inputModule: Function | {} | any[], results: ComponentType[]): void {
        if (!(results instanceof Array)) {
            throw new ProgrammingLollipopError('Can\'t invoke DiLollipopModule._parseModule without a results array');
        };
        if (inputModule instanceof Array) {
            inputModule.forEach(current => this._parseModule(current, results));
        } else if (typeof inputModule === 'function') {
            const componentInformation: ComponentType = _findComponentMetadata(inputModule);
            results.push(componentInformation);
        } else if (typeof inputModule === 'object') {
            Object.keys(inputModule).forEach(currentProperty => this._parseModule(inputModule[currentProperty], results));
        }
    }

}
