const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("plugin::multi-tenant.organization");
