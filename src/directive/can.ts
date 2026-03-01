import { effectScope, watchEffect, type Directive } from "vue";
import { AccessGuardSymbol } from "../provider/AccessGuardProvider";
import type { CanDirectiveValue, MatchMode } from "../types";
import { matchPermission } from "../core/matcher";

export const vCan: Directive<HTMLElement, CanDirectiveValue> = {
  mounted(el, binding) {
    const instance = binding.instance as any;
    if (!instance) return;

    let parent = instance.$.parent;
    let context;

    while (parent && !context) {
      context = parent.provides?.[AccessGuardSymbol];
      parent = parent.parent;
    }

    if (!context) {
      throw new Error("[AccessGuard] v-can used outside AccessGuardProvider");
    }

    const scope = effectScope();

    scope.run(() => {
      watchEffect(() => {
        const value = binding.value;

        let permission: string | string[];
        let mode: MatchMode = "any";

        if (typeof value === "string" || Array.isArray(value)) {
          permission = value;
        } else {
          permission = value.permission;
          mode = value.mode ?? "any";
        }

        const perms = context.user.value?.permissions ?? [];

        const allowed = matchPermission(perms, permission, mode);

        el.style.display = allowed ? "" : "none";
      });
    });

    (el as any)._scope = scope;
  },

  unmounted(el) {
    (el as any)._scope?.stop();
  },
};
