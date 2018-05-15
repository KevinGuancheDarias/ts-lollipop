import { AbstractControllerSecurityAdapter } from '../../controller-security/abstract-controller-security-adapter.module';
import { RequestFilter } from './request-filter';

/**
 * Configuration options that a ControllerAdapter can have
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ControllerAdapterConfiguration
 */
export interface ControllerAdapterConfiguration {

    /**
     * Security adapters to use
     *
     * @type {AbstractControllerSecurityAdapter[]}
     * @memberof ControllerAdapterConfiguration
     */
    securityAdapters?: AbstractControllerSecurityAdapter[];

    /**
     * Request filters that will run before the authentication
     *
     * @type {RequestFilter[]}
     * @memberof ControllerAdapterConfiguration
     */
    beforeAuthRequestFilters?: RequestFilter[];

    /**
     * Request filters, that will run <b>after</b> the authentication (so, will have authentication objects available)
     *
     * @type {RequestFilter[]}
     * @memberof ControllerAdapterConfiguration
     */
    afterAuthRequestFilters?: RequestFilter[];

    /**
     * Directories, that will be scanned by the controller
     *
     * @type {string[]}
     * @memberof ControllerAdapterConfiguration
     */
    directories: string[];

    /**
     * HTTP Port that the controller will use to listen
     *
     * @type {number}
     * @memberof ControllerAdapterConfiguration
     */
    listenPort: number;
}
