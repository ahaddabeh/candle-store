const path = require("path");
const faker = require("faker");
const fs = require("fs-extra");
const { ko } = require("faker/lib/locales");
const { get } = require("http");

require("dotenv").config();

const output = {
    products: [],
    categories: [],
    orders: [],
    customers: []
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
    image: "candle1.jpg",
    quantity_on_hand: getRandomInclusive(1, 1000)
})

const createCartItems = (productArray) => {
    let cart = []
    let currentProduct = {};
    for (let i = 0; i < getRandomInclusive(0, 4); i++) {
        currentProduct = productArray[getRandomInclusive(0, productArray.length - 1)];
        cart.push({
            id: currentProduct.id,
            price: currentProduct.price,
            title: currentProduct.title,
            quantity: getRandomInclusive(1, 3)
        })
    }
    return cart;
}

const generateCardNumber = () => {
    let cardNum = "";
    let randomInt = 0;
    for (let i = 0; i < 4; i++) {
        randomInt = getRandomInclusive(0, 9).toString();
        cardNum = cardNum + randomInt;
    }
    return cardNum;
}

const createCustomer = () => ({
    id: newId("customers"),
    first_name: faker.name.findName(),
    last_name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    shipping_address: {
        shipping_address: faker.address.streetAddress(),
        shipping_city: faker.address.city(),
        shipping_country: faker.address.country(),
        shipping_state: faker.address.state()
    },
    billing_address: {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        country: faker.address.country(),
        state: faker.address.state()
    },
    stripe_customer_id: faker.random.uuid(),
    stripe_payment_method_id: faker.random.uuid()
})


const createOrder = () => ({
    id: newId("orders"),
    customer_id: getRandomInclusive(0, output.customers.length),
    status: getRandomInclusive(0, 1) === 1 ? true : false,
    total: faker.commerce.price(10, 100, 2),
    cart_items: createCartItems(output.products),
    invoice_id: Date.now().toString(),
    stripe_charge_id: faker.random.uuid(),
    stripe_customer_id: faker.random.uuid(),
    stripe_payment_method_id: faker.random.uuid(),
    card_number: generateCardNumber()
})

for (let i = 0; i < 20; i++) {
    output.categories.push(createCategory())
}
for (let i = 0; i < 20; i++) {
    output.products.push(createProduct())
}
for (let i = 0; i < 20; i++) {
    output.customers.push(createCustomer())
}
for (let i = 0; i < 20; i++) {
    output.orders.push(createOrder())
}

fs.writeFileSync(
    path.join(__dirname, "output.json"),
    JSON.stringify(output, null, 2)
)