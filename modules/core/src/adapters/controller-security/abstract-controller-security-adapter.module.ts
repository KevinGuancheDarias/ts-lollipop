import { RequestFilter, EMPTY_REQUEST_FILTER } from '../controller/types/request-filter';
import { ControllerSecurityOptions } from './types/controller-security-options';
import { findSecurityDecoratorMetadata, isExcluded } from './decorators/security.decorator';
import { ControllerSecurityDecoratorOptions } from './types/controller-security-decorator-options';
import { RequestContext } from '../controller/types/request-context';
import { BadInputLollipopError } from '../../errors/bad-input-lollipop.error';
import { AbstractControllerAdapterModule } from '../controller/abstract-controller-adapter.module';

/**
 * Use to force type to be AbstractControllerSecurityAdapterModule
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface ControllerSecurityAdapterConstructor
 */
export interface ControllerSecurityAdapterConstructor {
    new(): AbstractControllerSecurityAdapterModule;
}

/**
 * Adapters that want to be used for security, must extend this class
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @abstract
 * @since 0.1.0
 * @class AbstractControllerSecurityAdapterModule
 */
export abstract class AbstractControllerSecurityAdapterModule {

    /**
     * Puts extra information in this header when an authentication error occurs
     *
     * @protected
     * @static
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    protected static readonly _HTTP_DEBUG_HEADER = 'X-Lollipop-Authentication-Status';

    /**
     *
     *
     * @protected
     * @type {AbstractControllerAdapterModule}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    protected _targetController: AbstractControllerAdapterModule;

    /**
     * Returns true, if the filter can execute authentication
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {RequestContext} request
     * @returns {boolean}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public abstract supports(requestContext: RequestContext): boolean;

    /**
     * Creates the security object (it should be added to requestContext.request.authenticationMetadata)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {RequestContext} requestContext
     * @returns {Promise<any>}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public abstract createRequestSecurityObject(requestContext: RequestContext): Promise<any>;

    /**
     * Checks if the information required to authenticate the user is valid <br>
     * For example in JWT, will check if token is not expired, and if the key checksum matchs
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {RequestContext} requestcontext
     * @returns {boolean} Returns true, if the credentials are valid
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public abstract isAuthenticated(requestContext: RequestContext): boolean;

    public constructor(protected _options: ControllerSecurityOptions) {
        if (typeof this._options.isRequired !== 'boolean') {
            this._options.isRequired = true;
        }
        if (!this._options.validationAction) {
            this._options.validationAction = async () => true;
        }
    }

    /**
     * Defines the target controller adapter
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {AbstractControllerAdapterModule} value
     * @returns {this}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public setControllerAdapter(value: AbstractControllerAdapterModule): this {
        this._targetController = value;
        return this;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {AbstractControllerAdapterModule}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public getControllerAdapter(): AbstractControllerAdapterModule {
        return this._targetController;
    }

    /**
     * Finds the security RequestFilter
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T class of target
     * @param {T} target instance
     * @param {keyof T} method
     * @returns {RequestFilter}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public findMethodSecurityFilter<T>(target: T, method: keyof T): RequestFilter {
        const securityMetadata: ControllerSecurityDecoratorOptions = findSecurityDecoratorMetadata(target, method);
        const excluded: boolean = isExcluded(target, method);
        return (!excluded && securityMetadata) || (!excluded && this._options.checkAll)
            ? {
                name: `${this.constructor.name}.findMethodSecurityFilter()`,
                body: async requestContext => {
                    let retVal: boolean;
                    const supports: boolean = this.supports(requestContext);
                    if (!supports && this._options.isRequired) {
                        const errorText = 'Authentication information is missing';
                        requestContext.response
                            .setHttpStatus(400, errorText)
                            .setBody(errorText);
                        retVal = false;
                    } else if (supports) {
                        retVal = await this._executeSecurityMethod(target, method, requestContext, securityMetadata);
                    } else {
                        retVal = true;
                    }

                    return retVal;
                }
            }
            : EMPTY_REQUEST_FILTER;
    }

    /**
     * Runs global validation registered with the module of all security modules for given request controller adapter
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestContext} requestContext
     * @param {ControllerSecurityDecoratorOptions} securityMetadata
     * @returns {Promise<boolean>} True If the authentication succed
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public async runModulesValidationActions(
        requestContext: RequestContext,
        securityMetadata: ControllerSecurityDecoratorOptions
    ): Promise<boolean> {
        let retVal: boolean;
        if (securityMetadata.targetModule) {
            const target = requestContext.request
                .getControllerAdapter()
                .getSecurityModules()
                .find(current => current.constructor === securityMetadata.targetModule);
            if (!target) {
                throw new BadInputLollipopError(
                    // tslint:disable-next-line:max-line-length
                    `No module of type ${securityMetadata.targetModule.name} is registered in adapter ${requestContext.request.getControllerAdapter().constructor.name}`
                );
            }
            retVal = await target.runValidationAction(requestContext);
        } else {
            const modules = requestContext.request.getControllerAdapter().getSecurityModules();
            for (const currentModule of modules) {
                retVal = await currentModule.runValidationAction(requestContext);
                if (!retVal) {
                    break;
                }
            }
        }
        return retVal;
    }

    /**
     * Runs the validation action (if not defined, asumes that the authentication follows)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RequestContext} requestContext
     * @returns {Promise<boolean>}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    public async runValidationAction(requestContext: RequestContext): Promise<boolean> {
        if (this._options.validationAction) {
            return await this._options.validationAction(requestContext);
        } else {
            return true;
        }
    }

    /**
     * Saves the required authentication metadata to the requestContext <br>
     * <b>IMPORTANT: Does NOT create a copy. it modifies real requestContext object</b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {RequestContext} requestContext
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    protected async _buildAuthenthicationMetadata(requestContext: RequestContext): Promise<void> {
        requestContext.request.setAuthenticationMetadata(await this.createRequestSecurityObject(requestContext));
    }

    /**
     * Runs the security method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @param {RequestContext} requestContext THIS METHOD alters this object
     * @param {ControllerSecurityDecoratorOptions} securityMetadata
     * @returns {Promise<boolean>}
     * @since 0.1.0
     * @memberof AbstractControllerSecurityAdapterModule
     */
    private async _executeSecurityMethod(
        target: Object,
        method: string,
        requestContext: RequestContext,
        securityMetadata: ControllerSecurityDecoratorOptions
    ): Promise<boolean> {
        await this._buildAuthenthicationMetadata(requestContext);
        let retVal = this.isAuthenticated(requestContext);
        if (!retVal) {
            requestContext.response.setHttpStatus(401);
            requestContext.response.setHeader(
                AbstractControllerSecurityAdapterModule._HTTP_DEBUG_HEADER,
                'isAuthenticated() failed'
            );
        } else {
            if (securityMetadata.overrideGlobalValidation) {
                if (typeof securityMetadata.customValidation === 'function') {
                    retVal = await securityMetadata.customValidation(requestContext);
                } else {
                    throw new BadInputLollipopError(
                        // tslint:disable-next-line:max-line-length
                        `Can NOT define overrideGlobalValidation to true, while the customValidation is undefined, in @Security at ${target.constructor.name}.${method}()`
                    );
                }
            } else {
                retVal = await this.runModulesValidationActions(requestContext, securityMetadata);
                if (retVal && typeof securityMetadata.customValidation === 'function') {
                    retVal = await securityMetadata.customValidation(requestContext);
                }
            }

            if (!retVal) {
                requestContext.response.setHttpStatus(401);
                requestContext.response.setHeader(
                    AbstractControllerSecurityAdapterModule._HTTP_DEBUG_HEADER,
                    'error in global or custom validators'
                );
            }
        }
        return retVal;
    }
}
