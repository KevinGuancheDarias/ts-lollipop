/**
 * Has the possible hook events that can be used
 *
 * @export
 * @enum {string}
 */
export enum FrameworkHooksEnum {
    BEFORE_INIT = 'beforeInit',

    DI_AFTER_COMPONENT_SCAN = 'diAfterComponentScan',

    DI_AFTER_INJECT = 'diAfterInject',
    DI_AFTER_POST_INJECT = 'diAfterPostInject',

    /**
     *  Actions to execute when ContextHolder.getLollipop() can be called
     */
    CONTEXT_AVAILABLE = 'contextAvailable',

    /**
     * Runs before CONTEXT_READY
     */
    CONTROLLERS_AFTER_SCAN = 'controllersAfterScan',

    /**
     * Actions to execute when @Controller has been succefully registered
     */
    CONTROLLERS_READY = 'controllersReady',

    /**
     * Actions to execute when all CONTEXT_AVAILABLE actions has been executed
     */
    CONTEXT_READY = 'contextReady'
}
