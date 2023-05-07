module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.state.user) {

      const loggedUserUserGroup = await strapi
        .query('plugin::multi-tenant.user-group')
        .findOne({
          where: {
            users: {
              id: { $in: ctx.state.user.id },
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

      ctx.query = {
        ...ctx.query,
        filters: {
          ...ctx.query.filters,
          ...(config.attribute
            ? { $or: 
              loggedUserUserGroups.map((data, idx) => (
              {
                [config.attribute]: {
                userGroup: { id: data }
                },
              }))
            }
            : { $or: 
              loggedUserUserGroups.map((data, idx) => (
              { userGroup: { id: data } 
              }))
            }
          )
        },
      }

      await next()
    }
  }
}
