/**
 * Config that can be passed to <i>Route</i> decorator
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface RouteConfig
 */
export interface RouteConfig {
    path: string;
    get?: boolean;
    post?: boolean;
    put?: boolean;
    delete?: boolean;
}
