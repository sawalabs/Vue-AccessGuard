import { defineComponent, provide, toRef, type PropType } from "vue";
import type { AccessUser } from "../types";

export const AccessGuardSymbol = Symbol("AccessGuard");

export const AccessGuardProvider = defineComponent({
  name: "AccessGuardProvider",
  props: {
    user: {
      type: Object as PropType<AccessUser>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const user = toRef(props, "user");

    provide(AccessGuardSymbol, {
      user,
    });

    return () => slots.default?.();
  },
});
