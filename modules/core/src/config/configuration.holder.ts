import { readFile, exists } from 'mz/fs';
import { BadConfigFileLollipopError } from './errors/bad-config-file-lollipop.error';
import { Configuration } from './types/configuration';

/**
 * Can be used to access the configuration from outside the context
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @class ConfigurationHolder
 */
export class ConfigurationHolder {

    /**
     * Resolves when the settings has been loaded
     *
     * @readonly
     * @static
     * @type {Promise<void>}
     * @since 0.1.0
     * @memberof ConfigurationHolder
     */
    public static get isReady(): Promise<void> {
        return this._isReady;
    }

    private static readonly DEFAULT_PATH = 'resources/config.json';
    private static _settings: Configuration;
    private static _isReady: Promise<void> = new Promise(resolve => ConfigurationHolder._promiseResolve = resolve);
    private static _promiseResolve: Function;

    /**
     * Loads the framework configuration
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} [customPath] Custom path to config.json (ignored, if not first load)
     * @returns {Promise<void>} Resolves when the configuration has been loaded
     * @since 0.1.0
     * @memberof ConfigurationHolder
     */
    public static async loadConfiguration(customPath?: string): Promise<void> {
        if (!this._settings) {
            this._settings = {};
            await this._loadFile(customPath);
            this._promiseResolve();
        }
    }

    /**
     * Return the configuration
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @returns {Promise<Configuration>}
     * @since 0.1.0
     * @memberof ConfigurationHolder
     */
    public static async getConfiguration(): Promise<Configuration> {
        await ConfigurationHolder.isReady;
        return ConfigurationHolder._settings;
    }

    private static async _loadFile(path?: string): Promise<void> {
        const targetPath = path
            ? path
            : ConfigurationHolder.DEFAULT_PATH;
        if (await exists(targetPath)) {
            try {
                const fileContent = await readFile(targetPath, 'utf-8');
                ConfigurationHolder._settings = JSON.parse(fileContent);
            } catch (e) {
                throw new BadConfigFileLollipopError(
                    'Bad JSON, or encoding in the filename, please check the file is valid JSON, and check if it is UTF-8 encoded'
                );
            }
            if (!ConfigurationHolder._settings) {
                ConfigurationHolder._settings = {};
            }
        } else {
            throw new BadConfigFileLollipopError(`Configuration file in path ${targetPath} doesn't exists`);
        }
    }

    private constructor() {
        // It's a holder class
    }

}
