import { defineComponent, provide, toRef } from "vue"

export const AccessGuardSymbol = Symbol('AccessGuard')

export const AccessGuardProvider = defineComponent({
    name: 'AccessGuardProvider',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup(props, { slots }) {
        const user = toRef(props, 'user')

        provide(AccessGuardSymbol, {
            user
        })

        return () => slots.default?.()
    }
})