const globalStatics = require("../../common/statics");
module.exports = (model) => ({
    ...globalStatics(model),
    // These are static methods that get added to our model. 
})