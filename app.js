// array stores shopping list items

// each item is an object w/ keys of name and price

const express = require("express");
const itemsRoutes = require('./itemsRoutes');

const app = express();

app.use(express.json());

app.use('/items', itemsRoutes);

app.use((error, req, res, next) => {
    return res.status(error.statusCode).send(error.message);
})

module.exports = app;