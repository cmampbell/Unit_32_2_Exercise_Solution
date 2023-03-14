const express = require('express');
const cart = require("./fakeDb");
const ExpressError = require('./expressError.js');

const router = new express.Router();

router.get('/', (req, res) => {
    return res.status(200).send(cart);
})

router.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError(400, 'Name and price required');
        const item = req.body;
        cart.push(item);
        return res.status(201).send({'added' : item });
    } catch(e) {
        return next(e);
    }
})

router.get('/:name', (req, res, next) => {
    try {
        const foundItem = cart.find(item => item.name == req.params.name);
        if(!foundItem) throw new ExpressError(404, 'Item not found in cart');
        return res.status(200).send({foundItem});
    } catch(e){
        return next(e);
    }
})

router.patch('/:name', (req, res, next) => {
    try {
        const foundItemIndex = cart.findIndex(item => item.name == req.params.name);

        if(foundItemIndex === -1) throw new ExpressError(404, 'Item not found in cart');

        if(cart[foundItemIndex].name !== req.body.name){
            cart[foundItemIndex].name = req.body.name;
        }
        if(cart[foundItemIndex].price !== req.body.price){
            cart[foundItemIndex].price = req.body.price;
        }

        const updatedItem = cart[foundItemIndex];

        return res.status(200).send({ 'updated': updatedItem });
    } catch(e){
        return next(e);
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        const foundItemIndex = cart.findIndex(item => item.name == req.params.name);

        if(foundItemIndex === -1) throw new ExpressError(404, 'Item not found in cart');

        cart.splice(foundItemIndex, 1);

        return res.status(200).send({'message': "Deleted"});
    } catch (e) {
        next(e);
    }
})

module.exports = router;