/**
 * Has the possible hook events that can be used
 *
 * @export
 * @enum {string}
 * @since 0.1.0
 */
export enum FrameworkHooksEnum {

    /**
     * @since 0.1.0
     */
    BEFORE_INIT = 'beforeInit',

    /**
     * @since 0.1.0
     */
    DI_AFTER_COMPONENT_SCAN = 'diAfterComponentScan',

    /**
     * @since 0.1.0
     */
    DI_AFTER_INJECT = 'diAfterInject',

    /**
     * @since 0.1.0
     */
    DI_AFTER_POST_INJECT = 'diAfterPostInject',

    /**
     * Actions to execute when ContextHolder.getLollipop() can be called
     *
     * @since 0.1.0
     */
    CONTEXT_AVAILABLE = 'contextAvailable',

    /**
     * Runs before CONTEXT_READY
     *
     * @since 0.1.0
     */
    CONTROLLERS_AFTER_SCAN = 'controllersAfterScan',

    /**
     * Actions to execute when @Controller has been succefully registered
     *
     * @since 0.1.0
     */
    CONTROLLERS_READY = 'controllersReady',

    /**
     * Actions to execute when all CONTEXT_AVAILABLE actions has been executed
     *
     * @since 0.1.0
     */
    CONTEXT_READY = 'contextReady'
}
