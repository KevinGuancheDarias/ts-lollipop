/**
 * Helper functions for interacting with Promises
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @class PromiseUtil
 */
export class PromiseUtil {

    /**
     * Executes all promises sequentially, so will wait for each promise to resolve, beforing running the next
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {any} context Lollipop context
     * @param {Function[]} promiseFunctions functions to run that returns a promise
     * @returns {Promise<void>} Resolves when all promises has been executed
     * @static
     * @since 0.1.0
     * @memberof PromiseUtil
     */
    public static async runPromisesSequentially(context: any, promiseFunctions: Function[]): Promise<void> {
        for (const currentPromiseFunction of promiseFunctions) {
            await currentPromiseFunction(context);
        }
    }

    private constructor() {
        // It's an util class
    }
}
