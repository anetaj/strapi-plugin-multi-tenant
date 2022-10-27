# Strapi plugin Multi-tenant

A Strapi plugin to make Strapi a full-fledged backend for your SaaS

## Features

- Have multiple SaaS customers use the same Strapi instance.
- Isolate content per organization or, more granularly, per user group.

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application.

```sh
# Using Yarn
yarn add strapi-plugin-multi-tenant

# Or using NPM
npm install strapi-plugin-multi-tenant
```

## How it works

The plugin adds Organization and UserGroup content types. Also, it provides middleware and policies that keep data isolated between tenants.

### Organization and UserGroup

**Organization** is a single business entity—for example, Google or Microsoft.

**UserGroup** is a group of users within an Organization. Most commonly, it's a department name, such as Engineering or Product, or a geographical division like Microsoft EMEA and Microsoft APAC.
This model lets you isolate content within a tenant. For example, Engineering need not have access to Product content. If you don't need such granularity, create a single UserGroup per Organization.
UserGroups can optionally create a hierarchy. For example, Acme HQ could have Acme Engineering and Acme Product as its immediate children. Acme Engineering could contain Frontend, Backend, and DevOps UserGroups. In this scenario, every User assigned to Engineering has access to content from Engineering and Frontend, Backend, and DevOps.

A **User** (from users-permissions plugin) can only belong to one UserGroup.

### Data isolation

The plugin comes with two ways to isolate data: a policy that only lets users change resources that belong to their UserGroup, and a middleware that enforces creating and fetching resources for their UserGroup. See the section below for usage.

## Usage

Let's consider an example. Acme Inc created a SaaS using Strapi as a backend. The application lets companies add notes and organize them into workspaces. Users should only have access to their department's workspaces.

### Configuration

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  "multi-tenant": {
    enabled: true,
  },
  // ...
});
```

Then, you'll need to build your admin panel:

```sh
# Using Yarn
yarn build

# Or using NPM
npm run build
```

### Strapi model

**Workspace** can contain many **Notes**. A workspace belongs to a single UserGroup.

```json
{
  "kind": "collectionType",
  "collectionName": "workspaces",
  "info": {
    "singularName": "workspace",
    "pluralName": "workspaces",
    "displayName": "Workspace"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string"
    },
    "notes": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::note.note",
      "mappedBy": "workspace"
    },
    "userGroup": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::multi-tenant.user-group",
      "inversedBy": "workspaces"
    }
  }
}
```

Note schema:

```json
{
  "kind": "collectionType",
  "collectionName": "notes",
  "info": {
    "singularName": "note",
    "pluralName": "notes",
    "displayName": "Note"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "text": {
      "type": "text"
    },
    "workspace": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::workspace.workspace",
      "inversedBy": "notes"
    }
  }
}
```

### Policy config

For routes that contain a resource ID, such as GET, PUT or DELETE `/workspaces/:id`, add `plugin::multi-tenant.is-same-user-group` to their route config.

Example configuration for Workspace router:

```js
{
    name: "plugin::multi-tenant.is-same-user-group", // plugin name
    config: {
        contentType: 'api::workspace.workspace' // which content type the route is for
    }
}
```

That's it! Use the same configuration for GET, PUT and DELETE `/workspaces/:id`.

```js
/**
 * workspace router
 */

import { factories } from "@strapi/strapi";

const sameUserGroupPolicyConfig = {
  name: "plugin::multi-tenant.is-same-user-group",
  config: {
    contentType: "api::workspace.workspace",
  },
};

export default factories.createCoreRouter("api::workspace.workspace", {
  config: {
    update: {
      policies: [sameUserGroupPolicyConfig],
    },
    delete: {
      policies: [sameUserGroupPolicyConfig],
    },
    findOne: {
      policies: [sameUserGroupPolicyConfig],
    },
  },
});
```

Note does not contain a relation to a UserGroup, but we still want to secure the resource. There are two ways to solve this problem: denormalize Note also to include a relation to a UserGroup, or configure the policy like so:

```js
{
  name: "plugin::multi-tenant.is-same-user-group",
  config: {
    contentType: 'api::note.note',
    attribute: 'workspace' // let the policy know which attribute to check for a relation with a UserGroup
  }
}
```

Complete config for Note:

```js
/**
 * note router
 */

import { factories } from "@strapi/strapi";

const sameUserGroupPolicyConfig = {
  name: "plugin::multi-tenant.is-same-user-group",
  config: {
    contentType: "api::note.note",
    attribute: "workspace",
  },
};

export default factories.createCoreRouter("api::note.note", {
  config: {
    update: {
      policies: [sameUserGroupPolicyConfig],
    },
    delete: {
      policies: [sameUserGroupPolicyConfig],
    },
    findOne: {
      policies: [sameUserGroupPolicyConfig],
    },
  },
});
```

### Find Many middleware

For endpoints that return a list of resources, such as `GET /workspaces`, use the following middleware config:

```js
find: {
  middlewares: [{
    name: "plugin::multi-tenant.find-same-user-group",
    config: {}
  }],
},
```

If there's no direct relation between a resource and a UserGroup, let the plugin know how to look for it. Config for `GET /notes`:

```js
find: {
  middlewares: [{
    name: "plugin::multi-tenant.find-same-user-group",
    config: {
      attribute: 'workspace' // find UserGroup on Workspace
    }
  }],
},
```

### Create middleware

For endpoints that create a resource, such as `POST /workspaces`, use the following middleware config:

```js
create: {
  middlewares: [{
    name: "plugin::multi-tenant.add-same-user-group",
    config: {}
  }],
},
```

If there's no direct relation between a resource and a UserGroup, let the plugin know how to look for it. Config for `GET /notes`:

```js
create: {
  middlewares: [{
    name: "plugin::multi-tenant.add-same-user-group",
    config: {
      attribute: 'workspace' // find UserGroup on Workspace
    }
  }],
},
```

All set! Your routes are now secure.
