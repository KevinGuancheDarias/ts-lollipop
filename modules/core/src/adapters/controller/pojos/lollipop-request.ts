import { ReadOnlyLollipopError } from '../../../errors/read-only.lollipop.error';
import { AbstractControllerAdapterModule } from '../abstract-controller-adapter.module';

/**
 * Represents the default object to be used as a dictionary key => value in the controller request parameters
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface RequestParamsMap
 * @since 0.1.0
 */
export interface RequestParamsMap {
    [key: string]: string;
}

/**
 * Represents a HTTP Request, has things like: <br>
 * <ul>
 * <li>GET params</li>
 * <li>Path params</li>
 * <li>POST params (if urlencoded) </li>
 * <li>JSON body (if used) </li>
 * <li> Parsed JSON </li>
 * <li>Authenthicated user (if security is enabled) </li>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class LollipopRequest
 * @since 0.1.0
 */
export class LollipopRequest {

    /**
     * If defined, will not allow to modify properties <br>
     * <b>Use case:</b> Only allow ControllerModules to create request, they should be immutable to user
     *
     * @private
     * @memberof Request
     */
    private _readOnly = false;

    private _path: string;
    private _controllerAdapter: AbstractControllerAdapterModule;
    private _getParams: RequestParamsMap = {};
    private _pathParams: RequestParamsMap = {};
    private _postParams: RequestParamsMap = {};
    private _headers: RequestParamsMap = {};
    private _jsonBody: string;
    private _parsedJson: any;
    private _authenticationMetadata: any;

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} path
     * @returns {this}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public setPath(path: string): this {
        this._checkReadOnly();
        this._path = path;
        return this;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {string}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getPath(): string {
        return this._path;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {AbstractControllerAdapterModule} value
     * @returns {this}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public setControllerAdapter(value: AbstractControllerAdapterModule): this {
        this._checkReadOnly();
        this._controllerAdapter = value;
        return this;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {AbstractControllerAdapterModule}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getControllerAdapter(): AbstractControllerAdapterModule {
        return this._controllerAdapter;
    }

    /**
     * Defines the map of GET params
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestParamsMap} inputMap
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof Request
     */
    public setGetParams(inputMap: RequestParamsMap): void {
        this._checkReadOnly();
        this._getParams = inputMap;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {RequestParamsMap}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getGetParams(): RequestParamsMap {
        return this._getParams;
    }

    /**
     * Defines the map of PATH params
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestParamsMap} inputMap
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof Request
     */
    public setPathParams(inputMap: RequestParamsMap): void {
        this._checkReadOnly();
        this._pathParams = inputMap;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {RequestParamsMap}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getPathParams(): RequestParamsMap {
        return this._pathParams;
    }

    /**
     * Defines the map of POST params
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestParamsMap} inputMap
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof Request
     */
    public setPostParams(inputMap: RequestParamsMap): void {
        this._checkReadOnly();
        this._postParams = inputMap;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {RequestParamsMap}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getPostParams(): RequestParamsMap {
        return this._postParams;
    }

    /**
     * Defines the HTTP headers
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestParamsMap} inputMap
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public setHeaders(inputMap: RequestParamsMap): void {
        this._checkReadOnly();
        this._headers = inputMap;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {RequestParamsMap}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getHeaders(): RequestParamsMap {
        return this._headers;
    }

    /**
     * Defines the json body
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} jsonBody
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof Request
     */
    public setJsonBody(jsonBody: string): void {
        this._checkReadOnly();
        this._jsonBody = jsonBody;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {string}
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getJsonBody(): string {
        return this._jsonBody;
    }

    /**
     * Defines the parsed JSON
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {*} input
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof Request
     */
    public setParsedJson(input: any): void {
        this._checkReadOnly();
        this._parsedJson = input;
    }

    /**
     * Returns the parsed JSON <br>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T Type of the JSON body
     * @returns {T} Parsed JSON with type <b>(NO instance)</b> specified by <i>T</i>
     * @since 0.1.0
     * @memberof Request
     */
    public getParsedJson(): any {
        return this._parsedJson;
    }

    /**
     * Defines the authentication metadata (such as logged in user)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T
     * @param {T} value New metadata value
     * @throws {ReadOnlyLollipopError} When Request is in read only state
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public setAuthenticationMetadata<T>(value: T): void {
        this._checkReadOnly();
        this._authenticationMetadata = value;
    }

    /**
     * Returns the metadata
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T type of the metadata object
     * @returns {T} stored metadata
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public getAuthenticationMetadata<T = any>(): T {
        return this._authenticationMetadata;
    }

    /**
     * Defines the Request as read only (No further modifications are accepted)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @since 0.1.0
     * @memberof LollipopRequest
     */
    public defineAsReadOnly(): void {
        this._readOnly = true;
    }

    /**
     * Throws when, object is defined as readOnly and you are trying to modify the object
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @memberof Request
     */
    private _checkReadOnly(): void {
        if (this._readOnly) {
            throw new ReadOnlyLollipopError(
                // tslint:disable-next-line:max-line-length
                'Request is in read only state, more information at https://www.kevinguanchedarias.com/permalink.php?target=TYbzZSqCuAPBtkIy'
            );
        }
    }

}
