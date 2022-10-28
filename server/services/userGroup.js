const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService(
  'plugin::multi-tenant.user-group',
  ({ strapi }) => ({
    async findAllowed(userId) {
      const loggedUserUserGroup = await strapi
        .query('plugin::multi-tenant.user-group')
        .findOne({
          where: {
            users: {
              id: { $in: [userId] },
            },
          },
          populate: [
            'organization',
            'organization.userGroups',
            'organization.userGroups.parent',
          ],
        })

      const organizationUserGroups = loggedUserUserGroup.organization.userGroups

      const findPath = (parentId, path = []) => {
        const updatedPath = [...path, parentId]
        const foundGroup = organizationUserGroups.find(
          (group) => group.parent?.id === parentId
        )
        if (foundGroup) {
          return findPath(foundGroup.id, updatedPath)
        } else {
          return updatedPath
        }
      }

      return findPath(loggedUserUserGroup.id)
    },
  })
)
