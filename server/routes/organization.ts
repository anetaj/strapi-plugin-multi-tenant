module.exports = {
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: `/organizations/:id`,
            handler: `organization.findOne`
        },
        {
            method: 'POST',
            path: `/organizations`,
            handler: `organization.create`,
        },
        {
            method: 'PUT',
            path: `/organizations/:id`,
            handler: `organization.update`,
        },
        {
            method: 'DELETE',
            path: `/organizations/:id`,
            handler: `organization.delete`,
        },
    ]
}
