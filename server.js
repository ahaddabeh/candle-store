const app = require("./src/app");
const { authenticateToken } = require("./src/api/middleware/auhenticateToken");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use("/api/products", require("./src/api/rest/routes/products"))
app.use("/api/categories", require("./src/api/rest/routes/categories"))
app.use("/api/admins", require("./src/api/rest/routes/admins"))
app.use("/api/cart", require("./src/api/rest/routes/cart"))
app.use("/api/orders", require("./src/api/rest/routes/orders"))
app.use("/api/customers", require("./src/api/rest/routes/customers"))

app.listen(PORT, HOST, () => console.log(`Server is running on PORT http://${HOST}:${PORT}`))
