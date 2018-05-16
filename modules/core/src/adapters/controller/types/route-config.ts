/**
 * Config that can be passed to <i>Route</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface RouteConfig
 */
export interface RouteConfig {

    /**
     *
     *
     * @type {string}
     * @since 0.1.0
     * @memberof RouteConfig
     */
    path: string;

    /**
     *
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof RouteConfig
     */
    get?: boolean;

    /**
     *
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof RouteConfig
     */
    post?: boolean;

    /**
     *
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof RouteConfig
     */
    put?: boolean;

    /**
     *
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof RouteConfig
     */
    delete?: boolean;
}
