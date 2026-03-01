import type { App } from "vue";
import { vCan } from "./directive/can";

export * from "./provider/AccessGuardProvider";
export * from "./composables/useAccessGuard";
export * from "./components/Guard";
export * from "./router/routerGuard";

export function install(app: App) {
  app.directive("can", vCan);
}
