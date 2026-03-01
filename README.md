<div align="center">
  <img src="./public/logo.png" alt="AccessGuard Logo" width="100%" />
</div>

# @sawalabs/vue-accessguard

The **vue-accessguard** library is a robust, lightweight **Role-Based Access Control (RBAC)** solution for **Vue 3** applications. It provides granular control over UI rendering and module protection using Directives, Components, and Composables for protecting views depending on user *roles* or *permissions*. It supports dynamic **Wildcard Matching** (e.g. `*` for Super Admin or `resource:*` for namespaces).

![Vue 3](https://img.shields.io/badge/Vue.js-3.5%2B-brightgreen?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Storybook](https://img.shields.io/badge/Storybook-10.2-FF4785)

## Features
- 🚀 **`v-can` Directive:** Quickly hide DOM elements using logical checks.
- 📦 **`<Guard>` Component:** Dynamically render elements reactively if conditions are met.
- 🛠️ **Composable (`useAccessGuard`):** A unified API to pragmatically validate authorization states within Vue components logic/setup context.
- ⭐ **Wildcard Permissions:** Simplify access checks using wildcard notation like `admin:*` or globally with `*`.
- 📘 **Storybook Integrated:** Interactive visual documentation inside `./src/stories`.
- ⚡ **Vite Support:** ES / UMD modules included. Built tightly with Vue 3 `provide` / `inject`.


## Installation

Using `pnpm`, `npm` or `yarn`:

```bash
pnpm add @sawalabs/vue-accessguard
```

## Setup & Configuration

Vue-accessguard needs an `AccessGuardProvider` context wrapped around the app layout. You need to provide user data with their `roles` and `permissions` to allow access management globally.

### 1. Register the Plugin
Include the plugin into your main entry file, like `main.ts`, in order to register the `v-can` directive globally.

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { install as AccessGuardPlugin } from '@sawalabs/vue-accessguard'

const app = createApp(App)

app.use(AccessGuardPlugin)
app.mount('#app')
```

### 2. Wrap App with `AccessGuardProvider`
Add `AccessGuardProvider` at the root component or main application layout. Supply the user permissions asynchronously.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AccessGuardProvider, type AccessUser } from '@sawalabs/vue-accessguard'

// Example of authentication user state
const currentUser = ref<AccessUser>({
  roles: ['editor'],
  permissions: ['post:read', 'post:write']
})
</script>

<template>
  <AccessGuardProvider :user="currentUser">
    <AppContent />
  </AccessGuardProvider>
</template>
```

---

## Core Concepts

Understanding these fundamental access concepts is the key to effectively using the Vue AccessGuard library parameters:

### `permissions` vs `roles`
* **`permissions`**: Fine-grained, action-oriented strings that explicitly describe what an entity can *do* within a system (e.g., `'article:read'`, `'post:delete'`, `'user:impersonate'`). Usually, these reflect direct API actions or view visibility rules.
* **`roles`**: Generalized groups or titles assigned to a user (e.g., `'admin'`, `'editor'`, `'viewer'`). Behind the scenes, a role is essentially a collection of various permissions. Use `roles` across broad system boundaries (e.g., entirely hiding the "Admin Area Layout") and `permissions` for specific sub-components (e.g., the "Delete" button within the dashboard).

### Match Modes (`any` vs `all`)
Whenever you pass an array of required roles or permissions strings to evaluate, AccessGuard needs to know *how* to evaluate them using the `mode` parameter:
* **`mode: 'any'` (Default)**: The check passes if the authenticated user has **at least one** of the requested strings. Used as a logical **OR**.
* **`mode: 'all'`**: The check strictly passes only if the authenticated user has **100%** of the requested strings. Used as a logical **AND**.

---

## Directives (`v-can`)

The `v-can` directive removes elements from the screen by manipulating the style `display: none` property based on user permissions.

```vue
<template>
  <!-- Single permission check -->
  <button v-can="'post:delete'">Delete Post</button>

  <!-- Multiple permission check (any of them will render) -->
  <button v-can="['post:edit', 'post:delete']">Manage Post</button>

  <!-- Strictly require ALL permissions in the array -->
  <button v-can="{ permission: ['post:edit', 'post:publish'], mode: 'all' }">
    Publish Post
  </button>
</template>
```

---

## Component (`<Guard>`)

The `<Guard>` component conditionally renders DOM trees based on *roles* or *permissions*. Unlike `v-can`, the entire DOM subtree inside `Guard` isn't created if the authorization fails.

```vue
<script setup lang="ts">
import { Guard } from '@sawalabs/vue-accessguard'
</script>

<template>
  <!-- Renders if user has 'admin' or 'manager' role -->
  <Guard :role="['admin', 'manager']" mode="any">
    <AdminPanel />
  </Guard>

  <!-- Only renders if user has both permissions -->
  <Guard :permission="['user:create', 'user:delete']" mode="all">
    <UserManagement />
  </Guard>
</template>
```

---

## Composable (`useAccessGuard`)

Used inside `<script setup>` contexts to handle granular logical flows pragmatically.

```vue
<script setup lang="ts">
import { useAccessGuard } from '@sawalabs/vue-accessguard'

const { can, cannot, hasRole } = useAccessGuard()

const submitForm = () => {
  if (!hasRole('admin')) {
    alert("Admins only!")
    return
  }
  
  if (can(['article:write', 'article:publish'], 'all')) {
    console.log("Ready to execute logic.")
  }
}
</script>

<template>
  <button @click="submitForm" :disabled="cannot('article:publish')">
    Submit
  </button>
</template>
```

---

## Wildcard Matching

Vue-accessguard scales linearly with enterprise needs with built in string-based access matchers:

- **Super Admin (`*`)**: Given the string `['*']`, AccessGuard bypasses all validations locally. Giving infinite access to all parts.
- **Resource Wildcard (`[resource]:*`)**: Providing user permissions such as `['post:*']` covers all operations linked to `can('post:read')`, `can('post:delete')`, `can('post:create')`.

## Storybook

You can visually test permission mocking by launching Storybook locally:

```bash
pnpm run storybook
```

Navigate to `http://localhost:6006` to modify UI controls, testing elements against random permutations.

---
**License**: MIT 
