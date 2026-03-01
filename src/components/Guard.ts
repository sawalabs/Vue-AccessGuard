import { computed, defineComponent } from "vue";
import { useAccessGuard } from "../composables/useAccessGuard";
import type { MatchMode } from "../types";

export const Guard = defineComponent({
    name: 'Guard',
    props: {
        permission: {
            type: [String, Array],
            required: false
        },
        role: {
            type: [String, Array],
            required: false
        },
        mode: {
            type: String as () => MatchMode,
            default: 'any'
        }
    },  
    setup(props, { slots }) {
        const context = useAccessGuard()

        const hasPermission = computed(() => {
            if (props.permission) {
                return context.can(props.permission as any, props.mode)
            }

            if (props.role) {
                return context.hasRole(props.role as any, props.mode)
            }

            return true
        })

        return () => (hasPermission.value ? slots.default?.() : null)
    }
})