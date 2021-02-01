const path = require("path");
const faker = require("faker");
const fs = require("fs-extra");
const { ko } = require("faker/lib/locales");
const { get } = require("http");

require("dotenv").config();

const output = {
    products: [],
    categories: [],
    // orders: [],
    // users: []
}

const getRandomInclusive = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const newId = (entity) => output[entity].length > 0 ? output[entity].length + 1 : 1

const createCategory = () => ({
    id: newId("categories"),
    title: faker.lorem.words(3)
})

/*
{
        
        "image": "candle1.jpg",
        "description": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate esse dicta ab, itaque rerum autem beatae magni optio distinctio nam nesciunt reiciendis. Veritatis nulla aspernatur minus itaque similique, cupiditate veniam.",
        "price": 12.99,
    }
*/

const createProduct = () => ({
    id: newId("products"),
    categoryId: output.categories[getRandomInclusive(0, output.categories.length - 1)].id,
    title: faker.lorem.words(3),
    ingredients: Array.from({ length: getRandomInclusive(3, 5) }, (k, v) => faker.lorem.words(1)),
    price: faker.commerce.price(10, 25, 2),
    description: faker.lorem.words(30),
    image: "candle1.jpg"
})

// const createOrder = () => ({
//     id: newId("orders"),
//     status: getRandomInclusive(0, 1) === 1 ? "shipped" : "pending",
//     total: faker.commerce.price(10, 100, 2),
//     products: Array.from({ length: getRandomInclusive(1, 4) }, () => getRandomInclusive(1, 20))
// })

for (let i = 0; i < 20; i++) {
    output.categories.push(createCategory())
}
for (let i = 0; i < 20; i++) {
    output.products.push(createProduct())
}
for (let i = 0; i < 20; i++) {
    output.orders.push(createOrder())
}

fs.writeFileSync(
    path.join(__dirname, "output.json"),
    JSON.stringify(output, null, 2)
)