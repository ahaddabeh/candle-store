const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.get("/api/test", (req, res) => {
    res.send("We got it");
})

app.listen(PORT, HOST, () => console.log(`Server is running on PORT http://${HOST}:${PORT}`))
