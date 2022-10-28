const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("plugin::multi-tenant.organization");
