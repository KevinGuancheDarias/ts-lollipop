import { Level } from 'ng2-logger';

/**
 * Represents the information of the config.json file
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface Configuration
 */
export interface Configuration {

    /**
     * Represents the path in which the framework content starts
     *
     * @type {string}
     * @memberof Configuration
     */
    basePath?: string;
    logLevel?: Level;

    /**
     * Uses the features to test if there is a circular dependency injection problem
     *
     * @type {boolean}
     * @memberof Configuration
     */
    createDependencyTree?: boolean;

    /**
     * Number of iterations before assuming there is a dependency injection problem
     *
     * @type {number}
     * @memberof Configuration
     */
    dependencyTryMaxCount?: number;
}
