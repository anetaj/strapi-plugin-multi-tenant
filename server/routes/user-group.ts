module.exports = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: `/user-groups`,
            handler: `user-group.find`
        },
        {
            method: 'GET',
            path: `/user-groups/:id`,
            handler: `user-group.findOne`,
        },
        {
            method: 'POST',
            path: `/user-groups`,
            handler: `user-group.create`,
        },
        {
            method: 'PUT',
            path: `/user-groups/:id`,
            handler: `user-group.update`,
        },
        {
            method: 'DELETE',
            path: `/user-groups/:id`,
            handler: `user-group.delete`,
        },
    ]
}