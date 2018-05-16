import { Log, Logger } from 'ng2-logger';
import { ConfigurationHolder } from '../config/configuration.holder';

/**
 *
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @class LollipopLogger
 */
export class LollipopLogger {
    private _logger: Logger<any>;

    /**
     * Writes DEBUG level messageResolves when the configuration has been loaded <br>
     * Used to delay log messages
     *
     * @private
     * @type {Promise<void>}
     * @since 0.1.0
     * @memberof LollipopLogger
     */
    private _isReady: Promise<void>;

    public constructor(private _targetClass: Function) {
        this._isReady = new Promise(async resolve => {
            await this._setupLogger();
            resolve();
        });
    }

    /**
     * Writes DEBUG level messageWrite debug messages
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {...string[]} message
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof LollipopLogger
     */
    public async debug(...message: string[]): Promise<void> {
        await this._isReady;
        this._logger.d(this._findCallerMethodName(), ...message);
    }

    /**
     * Writes INFO level message
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {...string[]} message
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof LollipopLogger
     */
    public async info(...message: string[]): Promise<void> {
        await this._isReady;
        this._logger.i(this._findCallerMethodName(), ...message);
    }

    /**
     * Writes WARN level message
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {...string[]} message
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof LollipopLogger
     */
    public async warn(...message: string[]): Promise<void> {
        await this._isReady;
        this._logger.w(this._findCallerMethodName(), ...message);
    }

    /**
     * Writes ERROR level message
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {...string[]} message
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof LollipopLogger
     */
    public async error(...message: string[]): Promise<void> {
        await this._isReady;
        this._logger.er(this._findCallerMethodName(), ...message);
    }

    private async _setupLogger(): Promise<void> {
        const settings = await ConfigurationHolder.getConfiguration();
        this._logger = Log.create(this._targetClass.name, settings.logLevel);
    }

    private _findCallerMethodName(): string {
        let method;
        if (this._isChromeOrNode()) {
            const err = new Error();
            const stackLines: string[] = err.stack.split('\n');
            const lastClassCall: string = stackLines.filter(current => current.indexOf(this._targetClass.name) !== -1)[0];
            const methodLine: string[] = /at \w+\.(\w+)/.exec(lastClassCall);
            if (methodLine) {
                return methodLine[1];
            } else if (lastClassCall) {
                return 'constructor';
            } else {
                const lastCallbackCall: string = stackLines.slice(1).find(current => current.indexOf('LoggerHelper') === -1).trim();
                const invocationLine: string = lastCallbackCall.substr(lastCallbackCall.length - 6).split(':')[0];
                return '(callback) L' + invocationLine;
            }
        } else {
            method = 'notKnown';
        }
        return method;
    }
    private _isChromeOrNode(): boolean {
        return typeof process === 'object' || /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }
}
