process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app')

let cart = require('./fakeDb')

let item = {'name': 'yogurt', 'price': 2.69}

beforeEach(() => cart.push(item))

afterEach(() => cart.length = 0 )

describe('GET /items', ()=> {
    test('Responds with all items in cart', async () => {
        const res = await request(app).get('/items')
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveLength(1)
    })
})

describe('GET /items/:name', () => {
    test('Responds with requested item', async () => {
        const res = await request(app).get(`/items/${item.name}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('foundItem', item);
    })

    test('Responds with 404 if item not found', async () => {
        const res = await request(app).get('/items/booger')

        expect(res.statusCode).toBe(404);
    })
})

describe('POST /items', () => {
    test('Add an item to cart', async() => {
        const res = await request(app).post('/items').send(
            {'name': 'taco', 'price': 3.50}
        )

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({'added': {'name': 'taco', 'price': 3.50}})
        expect(cart).toHaveLength(2)
    })

    test('POST /items w/ no data', async() => {
        const res = await request(app).post('/items').send({});
        
        expect(res.statusCode).toBe(400)
        expect(cart).toHaveLength(1)
    })

    test('POST /items w/ only name', async() => {
        const res = await request(app).post('/items').send({'name': 'butt'});
        
        expect(res.statusCode).toBe(400)
        expect(cart).toHaveLength(1)
    })

    test('POST /items w/ only name', async() => {
        const res = await request(app).post('/items').send({'price': 5.66});
        
        expect(res.statusCode).toBe(400)
        expect(cart).toHaveLength(1)
    })
})

describe('PATCH /items/:name', () => {
    test('Update an item in cart', async () => {
        const res = await request(app).patch(`/items/${item.name}`).send(
            {'name': 'beef', 'price': 4.50}
        )

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({'updated': {'name': 'beef', 'price': 4.50}})
    })

    test("Return 404 when item isn't in cart", async () =>{
        const res = await request(app).patch(`/items/salmon`).send(
            {'name': 'beef', 'price': 4.50}
        )
        
        expect(res.statusCode).toBe(404)
    })
})

describe('DELETE /items/:name', () => {
    test('Delete an item from the cart', async () => {
        const res = await request(app).delete(`/items/${item.name}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'message': 'Deleted'});
        expect(cart).toHaveLength(0);
    })

    test('Deleting fake item returns 404', async() => {
        const res = await request(app).delete(`/items/dragon`);

        expect(res.statusCode).toBe(404);
    })
})
