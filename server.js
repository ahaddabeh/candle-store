const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use("/api/products", require("./src/api/rest/routes/products"))
app.use("/api/categories", require("./src/api/rest/routes/categories"))
app.use("/api/cart", require("./src/api/rest/routes/cart"))

app.listen(PORT, HOST, () => console.log(`Server is running on PORT http://${HOST}:${PORT}`))
