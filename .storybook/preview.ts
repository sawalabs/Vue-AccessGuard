import type { Preview } from "@storybook/vue3-vite";
import { setup } from "@storybook/vue3";
import { computed } from "vue";
import { vCan } from "../src/directive/can";
import { AccessGuardProvider } from "../src/provider/AccessGuardProvider";

setup((app: any) => {
  app.directive("can", vCan);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (story, context) => ({
      components: { story, AccessGuardProvider },
      setup() {
        // Set a default user if the story doesn't provide one in args
        const user = computed(
          () => context.args.user || { roles: [], permissions: [] },
        );
        return { user };
      },
      template: `
        <AccessGuardProvider :user="user">
          <story />
        </AccessGuardProvider>
      `,
    }),
  ],
};

export default preview;
