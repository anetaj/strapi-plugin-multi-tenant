import { factories } from "@strapi/strapi";
// const userGroup = require('./user-group');
// const organization = require('./organization');

export default {
  'user-group': factories.createCoreController("plugin::multi-tenant.user-group"),
  organization: factories.createCoreController("plugin::multi-tenant.organization"),
};
