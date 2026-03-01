import { describe, it, expect } from "vitest";
import { matchPermission } from "./matcher";

describe("matchPermission", () => {
  describe("basic functionality", () => {
    it("should return false if user has no permissions", () => {
      expect(matchPermission([], "admin:read")).toBe(false);
      expect(matchPermission(undefined as any, "admin:read")).toBe(false);
    });

    it("should return true for exact matches", () => {
      expect(matchPermission(["admin:read"], "admin:read")).toBe(true);
      expect(
        matchPermission(["admin:read", "admin:write"], "admin:write"),
      ).toBe(true);
    });

    it("should return false for non-matching permissions", () => {
      expect(matchPermission(["admin:read"], "admin:write")).toBe(false);
    });
  });

  describe("wildcard matching", () => {
    it("should return true if super admin wildcard * is present", () => {
      expect(matchPermission(["*"], "admin:read")).toBe(true);
      expect(matchPermission(["*"], "anything")).toBe(true);
      expect(matchPermission(["user:read", "*"], "admin:write")).toBe(true);
    });

    it("should return true for resource-specific wildcard", () => {
      expect(matchPermission(["admin:*"], "admin:read")).toBe(true);
      expect(matchPermission(["admin:*"], "admin:write")).toBe(true);
      expect(matchPermission(["admin:*"], "admin:delete")).toBe(true);
    });

    it("should return false if resource-specific wildcard does not match", () => {
      expect(matchPermission(["user:*"], "admin:read")).toBe(false);
    });
  });

  describe('match modes ("any" vs "all")', () => {
    const userPerms = ["user:read", "post:read", "post:write"];

    describe("mode: any (default)", () => {
      it("should return true if user has at least one required permission", () => {
        expect(matchPermission(userPerms, ["user:read", "admin:read"])).toBe(
          true,
        );
        expect(
          matchPermission(userPerms, ["post:write", "user:write"], "any"),
        ).toBe(true);
      });

      it("should return false if user has none of the required permissions", () => {
        expect(matchPermission(userPerms, ["admin:read", "user:write"])).toBe(
          false,
        );
      });
    });

    describe("mode: all", () => {
      it("should return true if user has all required permissions", () => {
        expect(
          matchPermission(userPerms, ["user:read", "post:read"], "all"),
        ).toBe(true);
        expect(
          matchPermission(userPerms, ["post:read", "post:write"], "all"),
        ).toBe(true);
      });

      it("should return false if user is missing some required permissions", () => {
        expect(
          matchPermission(userPerms, ["user:read", "admin:read"], "all"),
        ).toBe(false);
      });

      it("should work with single permission string format", () => {
        // If checking an array of single perm with 'all'
        expect(matchPermission(userPerms, "user:read", "all")).toBe(true);
        expect(matchPermission(userPerms, "admin:read", "all")).toBe(false);
      });
    });

    describe("mixed wildcard and modes", () => {
      const adminPerms = ["admin:*", "user:read"];

      it('should evaluate "any" correctly with wildcards', () => {
        expect(
          matchPermission(adminPerms, ["admin:write", "settings:read"], "any"),
        ).toBe(true);
      });

      it('should evaluate "all" correctly with wildcards', () => {
        expect(
          matchPermission(
            adminPerms,
            ["admin:read", "admin:write", "user:read"],
            "all",
          ),
        ).toBe(true);
        expect(
          matchPermission(adminPerms, ["admin:read", "settings:read"], "all"),
        ).toBe(false);
      });
    });
  });
});
