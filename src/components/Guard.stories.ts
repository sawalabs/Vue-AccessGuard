import type { Meta, StoryObj } from "@storybook/vue3";
import { Guard } from "./Guard";

const meta: Meta<typeof Guard> = {
  title: "RBAC/Guard Component",
  component: Guard,
  tags: ["autodocs"],
  argTypes: {
    permission: {
      control: "text",
      description:
        "Specific action-oriented strings (e.g., 'post:edit'). Rejects render if the user lacks it.",
    },
    role: {
      control: "text",
      description:
        "Generalized access level titles (e.g., 'admin'). Rejects render if the user lacks this role.",
    },
    mode: {
      control: "radio",
      options: ["any", "all"],
      description:
        "`any` (default) acts as logical OR when an array is passed, meaning rendering succeeds if the user has **at least one**. `all` acts as logical AND, meaning the user must possess **every item**.",
    },
    // @ts-ignore
    user: {
      control: "object",
      description: "Current user data provided by AccessGuardProvider",
    },
  },
  args: {
    // @ts-ignore
    user: {
      roles: ["editor"],
      permissions: ["post:read", "post:write"],
    },
    mode: "any",
  },
};

export default meta;
type Story = StoryObj<typeof Guard>;

export const HasPermission: Story = {
  args: {
    permission: "post:write",
  },
  render: (args) => ({
    components: { Guard },
    setup() {
      return { args };
    },
    template: `
      <Guard v-bind="args">
        <div style="padding: 1rem; border: 2px solid green; border-radius: 4px; background: #e6ffe6; color: green;">
          ✅ You have the permission to see this content!
        </div>
      </Guard>
      <div style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 4px; font-family: monospace;">
        <strong>Current User:</strong> <br/>
        Roles: {{ args.user.roles.join(', ') || 'none' }} <br/>
        Permissions: {{ args.user.permissions.join(', ') || 'none' }}
      </div>
    `,
  }),
};

export const NoPermission: Story = {
  args: {
    permission: "post:delete",
  },
  render: (args) => ({
    components: { Guard },
    setup() {
      return { args };
    },
    template: `
      <div>
        <p>The content below is protected and should NOT be visible because the user lacks the 'post:delete' permission:</p>
        <Guard v-bind="args">
          <div style="padding: 1rem; border: 2px solid red; border-radius: 4px; background: #ffe6e6; color: red;">
            ❌ This should not be visible
          </div>
        </Guard>
      </div>
    `,
  }),
};

export const RoleBasedAccess: Story = {
  args: {
    role: "editor",
  },
  render: (args) => ({
    components: { Guard },
    setup() {
      return { args };
    },
    template: `
      <Guard v-bind="args">
        <div style="padding: 1rem; border: 2px solid blue; border-radius: 4px; background: #e6e6ff; color: blue;">
          ✅ You are an Editor, so you can see this content!
        </div>
      </Guard>
    `,
  }),
};
