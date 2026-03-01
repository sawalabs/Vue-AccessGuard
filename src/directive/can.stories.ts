import type { Meta, StoryObj } from "@storybook/vue3";

const Wrapper = {
  template: `
    <div>
      <div v-can="permission" style="padding: 1rem; border: 2px solid green; border-radius: 4px; background: #e6ffe6; color: green; margin-bottom: 20px;">
        ✅ You have the required permission so this div is visible!
      </div>

      <div style="padding: 1rem; background: #f0f0f0; border-radius: 4px; font-family: monospace;">
        <strong>Current User Configuration:</strong> <br/>
        Roles: {{ user.roles.join(', ') || 'none' }} <br/>
        Permissions: {{ user.permissions.join(', ') || 'none' }} <br/>
        v-can checking for: <strong>{{ typeof permission === 'object' ? JSON.stringify(permission) : permission }}</strong>
      </div>
    </div>
  `,
  props: {
    permission: {
      type: [String, Array, Object],
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
};

const meta: Meta<typeof Wrapper> = {
  title: "RBAC/v-can Directive",
  component: Wrapper,
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
      description: "Mocked user data",
    },
  },
  args: {
    user: {
      roles: ["user"],
      permissions: ["article:read", "article:write"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Wrapper>;

export const HasPermission: Story = {
  args: {
    permission: "article:write",
  },
};

export const HasMultiplePermissions: Story = {
  args: {
    permission: ["article:write", "article:publish"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "By default, passes if the user has **at least one** of the mentioned permissions.",
      },
    },
  },
};

export const MissingPermission: Story = {
  args: {
    permission: "article:delete",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The content is hidden via `display: none` because the permission is missing.",
      },
    },
  },
};

export const RequireAllPermissions: Story = {
  args: {
    permission: {
      permission: ["article:write", "article:publish"],
      mode: "all",
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Passes only if the user has **all** of the mentioned permissions using the mode object config.",
      },
    },
  },
};

export const WildcardAccess: Story = {
  args: {
    permission: "article:publish",
    user: {
      roles: ["admin"],
      permissions: ["article:*"],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Simulate namespaces wildcard `article:*` giving access to `article:publish`.",
      },
    },
  },
};
