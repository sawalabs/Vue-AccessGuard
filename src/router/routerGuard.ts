import type { Router } from "vue-router";
import { useAccessGuard } from "../composables/useAccessGuard";

export function applyAccessGuard(router: Router) {
  // Call useAccessGuard() synchronously so it properly hooks into the current Vue setup context
  const { can, hasRole } = useAccessGuard();

  // Register the guard interceptor and return the remover function
  return router.beforeEach((to) => {
    const meta = to.meta as any;

    if (meta.permission && !can(meta.permission, meta.mode)) {
      return meta.redirect || "/";
    }

    if (meta.role && !hasRole(meta.role, meta.mode)) {
      return meta.redirect || "/";
    }
  });
}
