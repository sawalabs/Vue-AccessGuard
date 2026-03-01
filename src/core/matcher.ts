import type { MatchMode } from "../types"

export function matchPermission(
    userPermission: string[], 
    required: string | string[],
    mode: MatchMode = 'any'
): boolean {
    if (!userPermission?.length) return false

    const requiredList = Array.isArray(required) ? required : [required]

    const check = (perm: string) => {
        // Check for super admin
        if (userPermission.includes('*')) return true

        if (userPermission.includes(perm)) return true

        const [resource] = perm.split(':')
        const wildcard = `${resource}:*`
        return userPermission.includes(wildcard)
    }

    if (mode === 'all') return requiredList.every(check)
    return requiredList.some(check)
}