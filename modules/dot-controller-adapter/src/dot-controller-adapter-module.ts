import * as express from 'express';
const dot = require('dot/dot.js');
import { readFile, exists, stat, Stats, writeFile } from 'mz/fs';

import { ModuleTypes } from '@ts-lollipop/core/dist/enums/module-types.enum';
import { ExpressControllerAdapterModule } from '@ts-lollipop/express-controller-adapter';
import { LollipopResponse, LollipopRequest } from '@ts-lollipop/core/dist/adapters/controller';
import { ViewInformation } from '@ts-lollipop/core/dist/adapters/controller/pojos/view-information';
import { FileNotFoundError } from '@ts-lollipop/core/dist/errors/file-not-found.error';
import { DotControllerAdapterConfiguration } from './types/dot-controller-adapter-configuration';
import { BadInputLollipopError, ProgrammingLollipopError } from '@ts-lollipop/core/dist/errors';
import { InMemoryCacheEntryView } from './types/cache-entry-view';

/**
 * ControllerAdapter that provides support for dotJS views
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class DotControllerAdapterModule
 * @since 0.2.0
 * @extends {AbstractControllerAdapterModule}
 */
export class DotControllerAdapterModule extends ExpressControllerAdapterModule<DotControllerAdapterConfiguration> {

    private static readonly _NEVER_HAPPEND = 'Should never happend';
    private _viewsCache: { [key: string]: InMemoryCacheEntryView } = {};

    /**
     * Creates an instance of DotControllerAdapterModule.
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {DotControllerAdapterConfiguration} settings
     * @param {express.Application} [_expressInstance]
     * @throws {BadInputLollipopError} Bad settings
     * @memberof DotControllerAdapterModule
     */
    public constructor(settings: DotControllerAdapterConfiguration, _expressInstance?: express.Application) {
        super(settings, _expressInstance);
    }

    public getModuleType(): ModuleTypes {
        return ModuleTypes.CONTROLLER;
    }

    public async registerModule(): Promise<void> {
        await this._checkViewSettings();
        await super.registerModule();
    }

    protected async _runFiltersAndHandleRequestResult(
        target: any,
        method: string,
        lollipopRequest: LollipopRequest,
        lollipopResponse: LollipopResponse,
        response: express.Response
    ): Promise<void> {
        this._runFiltersAndFollow(target, method, lollipopRequest, lollipopResponse, async () => {
            const viewInformation: ViewInformation = lollipopResponse.getBody();
            super._checkValidViewInformation(viewInformation);
            super._runFiltersAndHandleRequestResult(target, method, lollipopRequest, lollipopResponse, response, async () => {
                try {
                    const template: Function = await this._findViewContent(viewInformation.getFilename());
                    lollipopResponse.setBody(template(viewInformation.getViewParams()));
                } catch (e) {
                    lollipopResponse.setHttpStatus(500);
                    lollipopResponse.setBody(e.message);
                }
            });
        });

    }

    private _findTargetFilePath(viewFilename: string): string {
        return `${this._settings.viewsDirectory}/${viewFilename}.dot`;
    }

    private _findCacheFilePath(viewFilename: string): string {
        const relative = viewFilename.substr(
            viewFilename.indexOf(this._settings.viewsDirectory) + this._settings.viewsDirectory.length + 1
        );
        return `${this._settings.viewsCacheDirectory}/${relative}.js`;
    }
    private async _checkFileExists(targetFile): Promise<void> {
        if (!await exists(targetFile)) {
            throw new FileNotFoundError(`Template file ${targetFile} doesn't EXISTS`);
        }
    }

    private async _findViewContent(viewFilename: string): Promise<Function> {
        const targetFile = this._findTargetFilePath(viewFilename);
        if (!this._settings.doCacheViews || !(await !this._isCached(targetFile)) || (await this._mustRevalidateCache(targetFile))) {
            await this._checkFileExists(targetFile);
            const fileContent = await readFile(targetFile, 'utf-8');
            const template: Function = dot.template(fileContent);
            if (this._settings.doCacheViews) {
                this._cacheStore(viewFilename, template);
            }
            return template;
        } else {
            return await this._findCachedViewContent(viewFilename);
        }
    }

    private async _cacheStore(viewFilename: string, template: Function, ): Promise<void> {
        const filePath: string = this._findTargetFilePath(viewFilename);
        if (this._settings.doCacheViewsInMemory) {
            this._viewsCache[filePath] = {
                file: filePath,
                template,
                mtime: new Date()
            };
        } else if (this._settings.viewsCacheDirectory) {
            await writeFile(this._findCacheFilePath(filePath), `${template.toString()}; anonymous`, 'utf-8');
        } else {
            throw new ProgrammingLollipopError(DotControllerAdapterModule._NEVER_HAPPEND);
        }
    }

    private async _findCachedViewContent(viewFilename: string): Promise<Function> {
        if (this._settings.doCacheViewsInMemory) {
            return this._viewsCache[this._findTargetFilePath(viewFilename)].template;
        } else if (this._settings.viewsCacheDirectory) {
            return eval(await readFile(`${this._settings.viewsCacheDirectory}/${viewFilename}.dot.js`, 'utf-8'));
        } else {
            throw new ProgrammingLollipopError(DotControllerAdapterModule._NEVER_HAPPEND);
        }

    }


    /**
     * Detects in the input viewFilename exists in the cache
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @param {string} viewFilename
     * @returns {Promise<boolean>}
     * @memberof DotControllerAdapterModule
     */
    private async _isCached(viewFilename: string): Promise<boolean> {
        if (this._settings.doCacheViewsInMemory) {
            return !!this._viewsCache[viewFilename];
        } else if (this._settings.viewsCacheDirectory) {
            const cachedFile: string = this._findCacheFilePath(viewFilename);
            return await exists(cachedFile);
        } else {
            throw new ProgrammingLollipopError(DotControllerAdapterModule._NEVER_HAPPEND);
        }
    }
    private async _mustRevalidateCache(viewFilename: string): Promise<boolean> {
        if (this._settings.doRevalidateCache) {
            const sourceFileStat: Stats = await stat(viewFilename);
            if (this._settings.doCacheViewsInMemory) {
                return !this._viewsCache[viewFilename]
                    || (sourceFileStat.mtime.getTime() > this._viewsCache[viewFilename].mtime.getTime());
            } else if (this._settings.viewsCacheDirectory) {
                const cachedFile: string = this._findCacheFilePath(viewFilename);
                return !(await exists(cachedFile))
                    || (sourceFileStat.mtime.getTime() > (await stat(cachedFile)).mtime.getTime());
            } else {
                throw new ProgrammingLollipopError(DotControllerAdapterModule._NEVER_HAPPEND);
            }
        } else {
            return false;
        }
    }


    /**
     * Checks if the view settings are valid
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @returns {Promise<void>}
     * @memberof DotControllerAdapterModule
     */
    private async _checkViewSettings(): Promise<void> {
        if (this._settings.doCacheViews && this._settings.viewsCacheDirectory && this._settings.doCacheViewsInMemory) {
            throw new BadInputLollipopError('Can\'t specify viewsCacheDirectory and doCacheViewsInMemory, must use only one option');
        } else if (this._settings.doCacheViews && !this._settings.doCacheViewsInMemory && !this._settings.viewsCacheDirectory) {
            throw new BadInputLollipopError(
                'When defining doCacheViews setting, MUST specify caching strategy, for example doCacheViewsInMemory or viewsCacheDirectory'
            );
        }
        if (this._settings.viewsCacheDirectory) {
            if (!await exists(this._settings.viewsCacheDirectory)) {
                throw new FileNotFoundError(
                    `Path ${this._settings.viewsCacheDirectory} doesn't exists, expected a directory where to store cached views`
                );
            } else if (!(await stat(this._settings.viewsCacheDirectory)).isDirectory()) {
                throw new BadInputLollipopError(`Expcted ${this._settings.viewsCacheDirectory} to be a directory`);
            }
        }
    }
}
