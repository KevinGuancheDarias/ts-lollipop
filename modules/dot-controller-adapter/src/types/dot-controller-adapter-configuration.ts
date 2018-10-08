import { ControllerAdapterConfiguration } from '@ts-lollipop/core/dist/adapters/controller/types/controller-adapter-configuration';


/**
 * Adds Dot custom properties to dot controller adapter module
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface DotControllerAdapterConfiguration
 * @extends {ControllerAdapterConfiguration}
 */
export interface DotControllerAdapterConfiguration extends ControllerAdapterConfiguration {

    /**
     * Specify where should the ControllerAdapter search the views
     *
     * @type {string}
     * @memberof DotControllerAdapterConfiguration
     */
    viewsDirectory: string;


    /**
     * Specify if views should be cached or not
     *
     * @type {boolean}
     * @memberof DotControllerAdapterConfiguration
     */
    doCacheViews?: boolean;


    /**
     * Specify where to save the ca cached views <br>
     * Can't be specified when <i>doCacheViewsInMemory</i> is defined
     *
     * @type {string}
     * @memberof DotControllerAdapterConfiguration
     */
    viewsCacheDirectory?: string;


    /**
     * Cache the views in memory
     * Can't be specified when <i>viewsCacheDirectory</i> is defined
     *
     * @type {boolean}
     * @memberof DotControllerAdapterConfiguration
     */
    doCacheViewsInMemory?: boolean;


    /**
     * If truthy will always check if the view file has been modified, prior to using the cache <br>
     * Defaults to falsy
     *
     * @type {boolean}
     * @memberof DotControllerAdapterConfiguration
     */
    doRevalidateCache?: boolean;
}
