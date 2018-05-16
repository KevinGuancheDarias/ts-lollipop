import { Level } from 'ng2-logger';

/**
 * Represents the information of the config.json file
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface Configuration
 */
export interface Configuration {

    /**
     * Represents the path in which the framework content starts
     *
     * @type {string}
     * @since 0.1.0
     * @memberof Configuration
     */
    basePath?: string;

    /**
     *
     *
     * @type {Level}
     * @since 0.1.0
     * @memberof Configuration
     */
    logLevel?: Level;

    /**
     * Uses the features to test if there is a circular dependency injection problem
     *
     * @type {boolean}
     * @since 0.1.0
     * @memberof Configuration
     */
    createDependencyTree?: boolean;

    /**
     * Number of iterations before assuming there is a dependency injection problem
     *
     * @type {number}
     * @since 0.1.0
     * @memberof Configuration
     */
    dependencyTryMaxCount?: number;
}
