import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { useAccessGuard } from "./useAccessGuard";
import { AccessGuardProvider } from "../provider/AccessGuardProvider";

describe("useAccessGuard", () => {
  it("throws an error if used outside of AccessGuardProvider", () => {
    const TestComponent = defineComponent({
      setup() {
        useAccessGuard();
        return () => {};
      },
    });

    expect(() => mount(TestComponent)).toThrow(
      "useAccessGuard must be used within AccessGuardProvider",
    );
  });

  it("provides can, cannot, and hasRole functions", () => {
    const user = { permissions: ["user:read"], roles: ["editor"] };

    let injectedContext: any;

    const ChildComponent = defineComponent({
      setup() {
        injectedContext = useAccessGuard();
        return () => {};
      },
    });

    mount(AccessGuardProvider, {
      props: { user },
      slots: { default: ChildComponent },
    });

    expect(injectedContext).toBeDefined();
    expect(typeof injectedContext.can).toBe("function");
    expect(typeof injectedContext.cannot).toBe("function");
    expect(typeof injectedContext.hasRole).toBe("function");
  });

  describe("permission and role checking", () => {
    const user = {
      permissions: ["post:read", "post:write"],
      roles: ["author", "editor"],
    };
    let context: ReturnType<typeof useAccessGuard>;

    const ChildComponent = defineComponent({
      setup() {
        context = useAccessGuard();
        return () => {};
      },
    });

    beforeEach(() => {
      mount(AccessGuardProvider, {
        props: { user },
        slots: { default: ChildComponent },
      });
    });

    it('checks permissions using "can"', () => {
      expect(context.can("post:read")).toBe(true);
      expect(context.can("admin:read")).toBe(false);
      expect(context.can(["post:read", "admin:read"], "any")).toBe(true);
      expect(context.can(["post:read", "admin:read"], "all")).toBe(false);
    });

    it('checks inverse permissions using "cannot"', () => {
      expect(context.cannot("post:read")).toBe(false);
      expect(context.cannot("admin:read")).toBe(true);
      expect(context.cannot(["post:read", "admin:read"], "any")).toBe(false);
      expect(context.cannot(["post:read", "admin:read"], "all")).toBe(true);
    });

    it('checks roles using "hasRole"', () => {
      expect(context.hasRole("author")).toBe(true);
      expect(context.hasRole("admin")).toBe(false);
      expect(context.hasRole(["author", "admin"], "any")).toBe(true);
      expect(context.hasRole(["author", "admin"], "all")).toBe(false);
      expect(context.hasRole(["author", "editor"], "all")).toBe(true);
    });
  });
});
