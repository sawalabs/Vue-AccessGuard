import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { applyAccessGuard } from "./routerGuard";
import { useAccessGuard } from "../composables/useAccessGuard";

vi.mock("../composables/useAccessGuard", () => ({
  useAccessGuard: vi.fn(),
}));

describe("applyAccessGuard (Router Guard)", () => {
  let router: any;
  let mockCan: ReturnType<typeof vi.fn>;
  let mockHasRole: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCan = vi.fn();
    mockHasRole = vi.fn();

    // Setup the mock to return our mocked methods
    vi.mocked(useAccessGuard).mockReturnValue({
      can: mockCan,
      cannot: vi.fn(),
      hasRole: mockHasRole,
    } as any);

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "Home" } },
        {
          path: "/admin",
          component: { template: "Admin" },
          meta: { permission: "admin:read" },
        },
        {
          path: "/settings",
          component: { template: "Settings" },
          meta: { permission: "admin:write", redirect: "/unauthorized" },
        },
        {
          path: "/dashboard",
          component: { template: "Dashboard" },
          meta: { role: "admin" },
        },
        {
          path: "/unauthorized",
          component: { template: "Unauthorized" },
        },
      ],
    });

    applyAccessGuard(router);
  });

  it("allows navigation if route has no meta constraints", async () => {
    await router.push("/");
    expect(router.currentRoute.value.path).toBe("/");
    expect(mockCan).not.toHaveBeenCalled();
  });

  it('blocks navigation and redirects to "/" if permission check fails without explicit redirect', async () => {
    mockCan.mockReturnValue(false);
    await router.push("/admin");

    expect(mockCan).toHaveBeenCalledWith("admin:read", undefined);
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("blocks navigation and redirects to custom route if permission check fails", async () => {
    mockCan.mockReturnValue(false);
    await router.push("/settings");

    expect(mockCan).toHaveBeenCalledWith("admin:write", undefined);
    expect(router.currentRoute.value.path).toBe("/unauthorized");
  });

  it("allows navigation if permission check passes", async () => {
    mockCan.mockReturnValue(true);
    await router.push("/admin");

    expect(mockCan).toHaveBeenCalledWith("admin:read", undefined);
    expect(router.currentRoute.value.path).toBe("/admin");
  });

  it("blocks navigation if role check fails", async () => {
    mockHasRole.mockReturnValue(false);
    await router.push("/dashboard");

    expect(mockHasRole).toHaveBeenCalledWith("admin", undefined);
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("allows navigation if role check passes", async () => {
    mockHasRole.mockReturnValue(true);
    await router.push("/dashboard");

    expect(mockHasRole).toHaveBeenCalledWith("admin", undefined);
    expect(router.currentRoute.value.path).toBe("/dashboard");
  });
});
