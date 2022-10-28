module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.state.user) {
      const loggedUserUserGroup = await strapi
        .query("plugin::multi-tenant.user-group")
        .findOne({
          where: {
            users: {
              id: { $in: ctx.state.user.id },
            },
          },
        });

      ctx.query = {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          ...(config.attribute
            ? {
                [config.attribute]: {
                  userGroup: { id: loggedUserUserGroup.id },
                },
              }
            : { userGroup: { id: loggedUserUserGroup.id } }),
        },
      };

      await next();
    }
  };
};
