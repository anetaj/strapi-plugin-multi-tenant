import { Strapi } from '@strapi/strapi';

// const USER_SCHEMA_KEY = "plugin::users-permissions.user"
// const USER_GROUP_SCHEMA_KEY = "plugin::multi-tenant.user-group"

export default async ({ strapi }: { strapi: Strapi }) => {
  // const userSchema = strapi.contentTypes[USER_SCHEMA_KEY]

  // await strapi
  //   .plugin("content-type-builder")
  //   .services["content-types"].editContentType(USER_SCHEMA_KEY, {
  //     contentType: {
  //       ...userSchema,
  //       attributes: {
  //         ...userSchema.attributes,
  //         "userGroup": {
  //           "type": "relation",
  //           "relation": "manyToOne",
  //           "target": USER_GROUP_SCHEMA_KEY,
  //           "inversedBy": "users"
  //         },
  //       }
  //     }
  //   });
};
