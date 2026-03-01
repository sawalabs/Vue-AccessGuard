import { effectScope, watchEffect, type Directive } from "vue";
import { useAccessGuard } from "../composables/useAccessGuard";
import type { CanDirectiveValue, MatchMode } from "../types";

export const vCan: Directive<HTMLElement, CanDirectiveValue> = {
    mounted(el, binding) {
        const { can } = useAccessGuard()
        const scope = effectScope()

        scope.run(() => {
            watchEffect(() => {
                const value = binding.value
                
                let permission: string | string[]
                let mode: MatchMode = 'any'

                if (typeof value === 'string' || Array.isArray(value)) {
                    permission = value
                } else {
                    permission = value.permission
                    mode = value.mode ?? 'any'
                }

                const allowed = can(permission, mode)
                el.style.display = allowed ? '' : 'none'
            })
        })
    
        ;(el as any)._scope = scope
    },

    unmounted(el) {
        ;(el as any)._scope?.stop()
    }
}