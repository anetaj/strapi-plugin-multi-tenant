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
      var loggedUserUserGroups = [ loggedUserUserGroup.id ]
 
      const findPath = (parentId) => {

        const foundGroups = organizationUserGroups.filter(
          (group) => group.parent?.id === parentId
        )
        foundGroups.forEach(element => {
          loggedUserUserGroups = [...loggedUserUserGroups, element.id]
          findPath(element)
        });

      }

      findPath(loggedUserUserGroup.id)
      return loggedUserUserGroups
    },
  })
)
