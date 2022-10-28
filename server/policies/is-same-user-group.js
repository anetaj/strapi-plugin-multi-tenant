module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.params.id && policyContext.state.user) {
    const resource = await strapi.query(config.contentType).findOne({
      where: { id: policyContext.params.id },
      populate: config.attribute
        ? [`${config.attribute}.userGroup`]
        : ['userGroup'],
    })

    if (resource) {
      const userGroupIds = await strapi
        .service('plugin::multi-tenant.user-group')
        .findAllowed(policyContext.state.user.id)

      if (policyContext.request.body?.data) {
        // don't allow updating a relation if user doesn't own it
        const requestData = policyContext.request.body?.data
        const requestDataUserGroup = config.attribute
          ? requestData[config.attribute]?.userGroup
          : requestData.userGroup

        const requestDataUserGroupId =
          requestDataUserGroup && Number.isInteger(requestDataUserGroup)
            ? requestDataUserGroup
            : requestDataUserGroup.id

        if (!userGroupIds.includes(requestDataUserGroupId)) {
          return false
        }
      }

      const resourceUserGroup = config.attribute
        ? resource[config.attribute]?.userGroup
        : resource.userGroup

      return (
        userGroupIds.length &&
        resourceUserGroup &&
        userGroupIds.includes(resourceUserGroup?.id)
      )
    } else {
      return false
    }
  } else {
    return false
  }
}
