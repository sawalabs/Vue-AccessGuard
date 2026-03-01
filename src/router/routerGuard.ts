import type { Router } from "vue-router";
import { useAccessGuard } from "../composables/useAccessGuard";

export function applyAccessGuard(router: Router) {
  router.beforeEach((to) => {
    const { can, hasRole } = useAccessGuard();

    const meta = to.meta as any;

    if (meta.permission && !can(meta.permission, meta.mode)) {
      return meta.redirect || "/";
    }

    if (meta.role && !hasRole(meta.role, meta.mode)) {
      return meta.redirect || "/";
    }
  });
}
