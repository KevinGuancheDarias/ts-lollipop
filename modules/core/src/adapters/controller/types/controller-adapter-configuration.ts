import { AbstractControllerSecurityAdapter } from '../../controller-security/abstract-controller-security-adapter.module';
import { RequestFilter } from './request-filter';

/**
 * Configuration options that a ControllerAdapter can have
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface ControllerAdapterConfiguration
 */
export interface ControllerAdapterConfiguration {

    /**
     * Security adapters to use
     *
     * @type {AbstractControllerSecurityAdapter[]}
     * @since 0.1.0
     * @memberof ControllerAdapterConfiguration
     */
    securityAdapters?: AbstractControllerSecurityAdapter[];

    /**
     * Request filters that will run before the authentication
     *
     * @type {RequestFilter[]}
     * @since 0.1.0
     * @memberof ControllerAdapterConfiguration
     */
    beforeAuthRequestFilters?: RequestFilter[];

    /**
     * Request filters, that will run <b>after</b> the authentication (so, will have authentication objects available)
     *
     * @type {RequestFilter[]}
     * @since 0.1.0
     * @memberof ControllerAdapterConfiguration
     */
    afterAuthRequestFilters?: RequestFilter[];

    /**
     * Directories, that will be scanned by the controller
     *
     * @type {string[]}
     * @since 0.1.0
     * @memberof ControllerAdapterConfiguration
     */
    directories: string[];

    /**
     * HTTP Port that the controller will use to listen
     *
     * @type {number}
     * @since 0.1.0
     * @memberof ControllerAdapterConfiguration
     */
    listenPort: number;
}
