import { Strapi } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    if (ctx.state.user) {
      const loggedUserUserGroup = await strapi.query("plugin::multi-tenant.user-group").findOne({
        where: {
          users: {
            id: { $in: ctx.state.user.id },
          }
        },
      });

      if (!loggedUserUserGroup) {
        return ctx.badRequest("User does not belong to a user group")
      }

      if (config.attribute && !ctx.request.body?.data?.[config.attribute]) {
        return ctx.badRequest(`Request body must include ${config.attribute}`)
      }

      if (config.attribute) {
        const relationService = strapi.contentType(config.contentType)?.attributes?.[config.attribute].target
        const foreignKey = ctx.request.body?.data?.[config.attribute]
        const attributeId = Number.isInteger(foreignKey) ? foreignKey : foreignKey.id

        const resourceToLink = await strapi.query(relationService).findOne({
          where: {
            id: attributeId,
          },
          populate: ['userGroup']
        });

        if (!resourceToLink) {
          return ctx.notFound(`Resource "${config.attribute}" with ID ${attributeId} not found`)
        }

        if (resourceToLink.userGroup.id !== loggedUserUserGroup.id) {
          return ctx.forbidden()
        }

        ctx.request.body = {
          ...ctx.request.body,
          data: {
            ...ctx.request.body.data,
            [config.attribute]: resourceToLink,
          },
        };
      } else {
        ctx.request.body = {
          ...ctx.request.body,
          data: {
            ...ctx.request.body.data,
            userGroup: loggedUserUserGroup.id,
          },
        };
      }

      return await next();
    }
  };
};
