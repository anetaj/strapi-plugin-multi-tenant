const { ValidationError } = require('@strapi/utils').errors

module.exports = {
  beforeCreate(event) {
    const { parent, children } = event.params.data

    if (children?.includes(parent)) {
      throw new ValidationError('User group cannot be both child and parent')
    }
  },
  beforeUpdate(event) {
    const { parent, children } = event.params.data
    const { id } = event.params.where

    if (children?.includes(parent)) {
      throw new ValidationError('User group cannot be both child and parent')
    }

    if (children?.includes(id) || parent === id) {
      throw new ValidationError('User group cannot be its own child or parent')
    }
  },
}
