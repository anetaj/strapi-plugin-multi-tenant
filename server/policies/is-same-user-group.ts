import { Strapi } from '@strapi/strapi';

export default async (policyContext, config, { strapi }: { strapi: Strapi }) => {
  if (policyContext.params.id && policyContext.state.user) {
    const resource = await strapi.query(config.contentType).findOne({
      where: { id: policyContext.params.id },
      populate: config.attribute ? [`${config.attribute}.userGroup`] : ['userGroup']
    });

    const loggedUserUserGroup = await strapi.query("plugin::multi-tenant.user-group").findOne({
      where: {
        users: {
          id: { $in: policyContext.state.user.id },
        }
      },
    });

    const resourceUserGroup = config.attribute ? resource?.[config.attribute]?.userGroup : resource?.userGroup

    return loggedUserUserGroup && resourceUserGroup?.id === loggedUserUserGroup.id;
  } else {
    return false;
  }
};
