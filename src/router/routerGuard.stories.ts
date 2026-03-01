import type { Meta, StoryObj } from "@storybook/vue3";
import { defineComponent, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { applyAccessGuard } from "./routerGuard";

import { vueRouter } from "storybook-vue3-router";

const MockRouterApp = defineComponent({
  template: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
      <nav style="background: #f0f0f0; padding: 1rem; border-bottom: 1px solid #ccc; display: flex; gap: 1rem;">
        <router-link to="/">Home (Public)</router-link>
        <router-link to="/admin">Admin Area</router-link>
        <router-link to="/editor">Editor Area</router-link>
      </nav>
      <main style="padding: 2rem;">
        <router-view></router-view>
      </main>
      <div style="background: #e6f7ff; padding: 1rem; border-top: 1px solid #ccc; font-size: 0.9em;">
        <strong>Current User Info:</strong><br/>
        Roles: {{ currentUser.roles?.join(', ') || 'None' }}<br/>
        Permissions: {{ currentUser.permissions?.join(', ') || 'None' }}
      </div>
    </div>
  `,
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    // Must be called synchronously inside `setup` to properly bind Vue's inject()
    const removeGuard = applyAccessGuard(router);

    // Initial redirect to clear previous story state
    onMounted(() => {
      router.push("/");
    });

    // Clean up the router guard so it doesn't pile up when switching args in Storybook!
    onBeforeUnmount(() => {
      removeGuard();
    });

    return { currentUser: props.user };
  },
});

const customRoutes = [
  {
    path: "/",
    name: "Home",
    component: {
      template:
        "<div><h1>Home</h1><p>Everyone can access this public page.</p></div>",
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: {
      template:
        '<div style="color: red;"><h1>Admin Dashboard</h1><p>You have successfully bypassed the router guard by having the "admin" role!</p></div>',
    },
    meta: { role: "admin" },
  },
  {
    path: "/editor",
    name: "Editor",
    component: {
      template:
        '<div style="color: blue;"><h1>Editor Workspace</h1><p>You have successfully bypassed the router guard by having the "post:write" permission!</p></div>',
    },
    meta: { permission: "post:write" },
  },
];

const meta: Meta<typeof MockRouterApp> = {
  title: "RBAC/Router Guard",
  component: MockRouterApp,
  tags: ["autodocs"],
  decorators: [vueRouter(customRoutes)],
  argTypes: {
    user: {
      control: "object",
      description: "Mocked authenticated user",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockRouterApp>;

export const DefaultPublic: Story = {
  args: {
    user: {
      roles: ["guest"],
      permissions: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "By default, the user is a `guest`. Without proper permissions, clicking on 'Admin' or 'Editor' navigation links will silently block and redirect them back to `/`.",
      },
    },
  },
};

export const WithAdminRole: Story = {
  args: {
    user: {
      roles: ["admin"],
      permissions: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This user has the `admin` role. The `router.beforeEach` interceptor will validate `meta: { role: 'admin' }` and grant access when navigating to the Admin page.",
      },
    },
  },
};

export const WithEditorPermission: Story = {
  args: {
    user: {
      roles: ["guest"],
      permissions: ["post:read", "post:write"],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This user has a specific granular `post:write` permission. The route `/editor` is protected via `meta: { permission: 'post:write' }`. Clicking Editor Area will allow routing to complete.",
      },
    },
  },
};
