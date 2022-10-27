import { Strapi } from '@strapi/strapi';

export default async ({ strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'multi-tenant',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
