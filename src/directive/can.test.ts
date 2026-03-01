import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { vCan } from "./can";
import { AccessGuardProvider } from "../provider/AccessGuardProvider";

describe("vCan Directive", () => {
  const createWrapper = (user: any, template: string) => {
    const Child = defineComponent({
      directives: { can: vCan },
      template,
    });

    const Root = defineComponent({
      components: { AccessGuardProvider, Child },
      template: `
        <AccessGuardProvider :user="user">
          <Child />
        </AccessGuardProvider>
      `,
      data() {
        return { user };
      },
    });

    return mount(Root);
  };

  it("shows element if user has permission (string format)", () => {
    const wrapper = createWrapper(
      { permissions: ["admin:read"] },
      `<div v-can="'admin:read'" id="target">Content</div>`,
    );

    const target = wrapper.find("#target");
    expect((target.element as HTMLElement).style.display).not.toBe("none");
  });

  it("hides element if user lacks permission", () => {
    const wrapper = createWrapper(
      { permissions: ["user:read"] },
      `<div v-can="'admin:read'" id="target">Content</div>`,
    );

    const target = wrapper.find("#target");
    expect((target.element as HTMLElement).style.display).toBe("none");
  });

  it('supports array of permissions (defaults to "any" mode)', () => {
    const wrapper = createWrapper(
      { permissions: ["post:read"] },
      `<div v-can="['post:read', 'admin:read']" id="target">Content</div>`,
    );

    const target = wrapper.find("#target");
    expect((target.element as HTMLElement).style.display).not.toBe("none");
  });

  it('supports object syntax with mode "all"', () => {
    // User missing one permission → hidden
    let wrapper = createWrapper(
      { permissions: ["post:read"] },
      `<div v-can="{ permission: ['post:read', 'post:write'], mode: 'all' }" id="target">Content</div>`,
    );

    expect((wrapper.find("#target").element as HTMLElement).style.display).toBe(
      "none",
    );

    // User has both → visible
    wrapper = createWrapper(
      { permissions: ["post:read", "post:write"] },
      `<div v-can="{ permission: ['post:read', 'post:write'], mode: 'all' }" id="target">Content</div>`,
    );

    expect(
      (wrapper.find("#target").element as HTMLElement).style.display,
    ).not.toBe("none");
  });

  it("reacts to permission changes (reactivity)", async () => {
    const wrapper = createWrapper(
      { permissions: ["user:read"] },
      `<div v-can="'admin:read'" id="target">Content</div>`,
    );

    const target = wrapper.find("#target");

    // Initially hidden
    expect((target.element as HTMLElement).style.display).toBe("none");

    // Update reactive user in Root
    (wrapper.vm as any).user = { permissions: ["admin:read"] };
    await nextTick();

    // Should now be visible
    expect((target.element as HTMLElement).style.display).not.toBe("none");
  });
});
