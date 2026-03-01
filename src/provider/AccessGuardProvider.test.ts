import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, inject } from "vue";
import { AccessGuardProvider, AccessGuardSymbol } from "./AccessGuardProvider";

describe("AccessGuardProvider", () => {
  it("provides user data to descendant components", () => {
    const user = { permissions: ["admin:read"], roles: ["admin"] };

    // Create a child component to inject the provided data
    const Child = defineComponent({
      setup() {
        const context = inject<{ user: { value: typeof user } }>(
          AccessGuardSymbol,
        );
        return { userContext: context?.user.value };
      },
      template: `<div>{{ userContext?.roles?.[0] }} - {{ userContext?.permissions?.[0] }}</div>`,
    });

    const wrapper = mount(AccessGuardProvider, {
      props: { user },
      slots: {
        default: Child,
      },
    });

    expect(wrapper.text()).toContain("admin - admin:read");
  });

  it("renders default slot", () => {
    const wrapper = mount(AccessGuardProvider, {
      props: {
        user: { permissions: [], roles: [] },
      },
      slots: {
        default: '<div class="slotted-content">Content</div>',
      },
    });

    expect(wrapper.find(".slotted-content").exists()).toBe(true);
    expect(wrapper.text()).toBe("Content");
  });
});
