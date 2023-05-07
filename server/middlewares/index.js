const findSameUserGroup = require('./find-same-user-group')
const addSameUserGroup = require('./add-same-user-group')
const findHierarchyUserGroup = require('./find-hierarchy-user-group')

module.exports = {
  'find-same-user-group': findSameUserGroup,
  'add-same-user-group': addSameUserGroup,
  'find-hierarchy-user-group': findHierarchyUserGroup,
}
