const express = require('express');
const router = express.Router();
const Product = require('../../dblayer/product');
const { Error } = require('mongoose');
const GenerateResponse = require('../../utils/response_creator');

// HTTP get method to get list of products, this function would get invoked at /products/ API call 
router.get('/',async (req,res) => {
    const products = await getProducts();
    res.json(new GenerateResponse(true, undefined, products));
});

// HTTP post method to add a new product, this function would get invoked at /products/ API call
router.post('/', async (req,res) => {
    const productObj = req.body;

    try {
        await Product.create(req.body);
        // Return all products as response
        const products = await getProducts();
        res.json(new GenerateResponse(true, undefined, products));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

// HTTP put method to update an existing product, this function would get invoked at /products/ API call
router.put('/', async (req,res) => {
    const productObj = req.body;
    try {
        const upResult = await Product.findOneAndUpdate({ _id: productObj._id }, { name: productObj.name, price: productObj.price }, { returnDocument: 'after' });
        // Return all products as response
        const products = await getProducts();
        res.send(new GenerateResponse(true,undefined,products));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

// HTTP delete method to delete an existing product, this function would get invoked at /products/ API call
router.delete('/:id', async (req,res) => {
    try {
        const delResult = await Product.deleteOne({ _id: req.params.id });
        if(delResult.hasOwnProperty("deletedCount") && delResult.deletedCount === 1){
            // Return remaining products as response
            const products = await getProducts();
            res.json(new GenerateResponse(true, undefined, products));   
        } else {
            res.json(new GenerateResponse(false, "Product to delete user at the moment."));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json(new GenerateResponse(false, "Product not found"));
        }
        res.json(new GenerateResponse(true, undefined, product));
    } catch (error) {
        res.status(500).json(new GenerateResponse(false, error.message));
    }
});
router.put('/:id', async (req,res) => {
    const productId = req.params.id;
    const productObj = req.body;
    try {
        const upResult = await Product.findOneAndUpdate({ _id: productId }, { name: productObj.name, price: productObj.price }, { returnDocument: 'after' });
        // Return all products as response
        const products = await getProducts();
        res.send(new GenerateResponse(true,undefined,products));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});


async function getProducts(){
    const products = await Product.find({}).lean();
    return products instanceof Array ? products : [];
}

module.exports = router;