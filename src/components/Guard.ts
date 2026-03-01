import { computed, defineComponent } from "vue";
import { useAccessGuard } from "../composables/useAccessGuard";
import type { MatchMode } from "../types";

export const Guard = defineComponent({
  name: "Guard",
  props: {
    permission: {
      type: [String, Array],
      required: false,
    },
    role: {
      type: [String, Array],
      required: false,
    },
    mode: {
      type: String as () => MatchMode,
      default: "any",
    },
  },
  setup(props, { slots }) {
    const context = useAccessGuard();

    const hasPermission = computed(() => {
      if (!props.permission && !props.role) return true;

      let allowed = true;

      if (props.permission) {
        allowed = allowed && context.can(props.permission as any, props.mode);
      }

      if (props.role && allowed) {
        allowed = allowed && context.hasRole(props.role as any, props.mode);
      }

      return allowed;
    });

    return () => (hasPermission.value ? slots.default?.() : null);
  },
});
