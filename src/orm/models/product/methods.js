module.exports = (DataTypes) => ({
    // These functions get called immediately when the data comes in
    getPriceFormatted: function () {
        return `$${this.get("price").toFixed(2)}`
    }

})