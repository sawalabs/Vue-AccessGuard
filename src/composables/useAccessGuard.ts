import { inject } from "vue";
import { AccessGuardSymbol } from "../provider/AccessGuardProvider";

export function useAccessGuard() {
    const context = inject<any>(AccessGuardSymbol)

    if (!context) {
        throw new Error('useAccessGuard must be used within AccessGuardProvider')
    }

    const can = (permission: string) => {
        const perms = context.user.value?.permissions || []
        return perms.includes(permission) || perms.includes('*')
    }

    const hasRole = (role: string) => {
        const roles = context.user.value?.roles || []
        return roles.includes.role
    }

    return {
        can,
        cannot: (permission: string) => !can(permission),
        hasRole
    }
}