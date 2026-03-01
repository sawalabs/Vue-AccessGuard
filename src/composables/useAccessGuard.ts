import { inject } from "vue";
import { AccessGuardSymbol } from "../provider/AccessGuardProvider";
import { matchPermission } from "../core/matcher";
import type { AccessUser, MatchMode } from "../types";

export function useAccessGuard<
  P extends string = string,
  R extends string = string,
>() {
  const context = inject<{ user: { value: AccessUser<P, R> } }>(
    AccessGuardSymbol,
  );

  if (!context) {
    throw new Error("useAccessGuard must be used within AccessGuardProvider");
  }

  const can = (permission: P | P[], mode: MatchMode = "any") => {
    const perms = context.user.value?.permissions || [];
    return matchPermission(perms, permission, mode);
  };

  const hasRole = (role: R | R[], mode: MatchMode = "any") => {
    const roles = context.user.value?.roles || [];
    const roleList = Array.isArray(role) ? role : [role];

    if (mode === "all") return roleList.every((role) => roles.includes(role));
    return roleList.some((role) => roles.includes(role));
  };

  return {
    can,
    cannot: (permission: P | P[], mode?: MatchMode) => !can(permission, mode),
    hasRole,
  };
}
