import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Guard } from "./Guard";
import { AccessGuardProvider } from "../provider/AccessGuardProvider";
import { defineComponent } from "vue";

describe("Guard Component", () => {
  const createUserAndMount = (user: any, props: any) => {
    const ChildComponent = defineComponent({
      components: { Guard },
      template: `
                <Guard v-bind="props">
                    <span id="target">Visible Content</span>
                </Guard>
            `,
      setup() {
        return { props };
      },
    });

    return mount(AccessGuardProvider, {
      props: { user },
      slots: { default: ChildComponent },
    });
  };

  it("renders slot content if user has the correct permission", () => {
    const user = { permissions: ["admin:read"] };
    const wrapper = createUserAndMount(user, { permission: "admin:read" });

    expect(wrapper.find("#target").exists()).toBe(true);
    expect(wrapper.text()).toContain("Visible Content");
  });

  it("does not render slot content if user lacks the permission", () => {
    const user = { permissions: ["user:read"] };
    const wrapper = createUserAndMount(user, { permission: "admin:read" });

    expect(wrapper.find("#target").exists()).toBe(false);
  });

  it("renders slot content if user has the correct role", () => {
    const user = { roles: ["admin"] };
    const wrapper = createUserAndMount(user, { role: "admin" });

    expect(wrapper.find("#target").exists()).toBe(true);
  });

  it('handles arrays and mode="all"', () => {
    const user = { permissions: ["post:read", "post:write"] };
    const wrapper = createUserAndMount(user, {
      permission: ["post:read", "post:write"],
      mode: "all",
    });

    expect(wrapper.find("#target").exists()).toBe(true);
  });

  it("renders by default if neither permission nor role is provided", () => {
    const user = { permissions: [], roles: [] };
    const wrapper = createUserAndMount(user, {});

    expect(wrapper.find("#target").exists()).toBe(true);
  });
});
