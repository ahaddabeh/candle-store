module.exports = (model) => ({
    // These are static methods that get added to our model. 
    // Doing this allows us to put where options in our query (For example if we wanted to filter our search for a specific category)
    findWithCount: async (page, _options = {}) => {
        const { limit = 3, where = null } = _options
        const offset = (+page - 1) * +limit;
        const options = {
            where,
            limit: +limit,
            offset: offset
        }
        return await model.findAndCountAll(options)
    }
})