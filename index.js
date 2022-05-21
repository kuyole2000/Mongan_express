const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const AppError = require('./AppError');

const Product = require('./models/product');
const res = require('express/lib/response');

mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(()=>{
        console.log('CONNECTION OPEN!!')
    })
    .catch(err =>{
        console.log('OH NO ERROR')
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.get('/products', async (req,res) =>{
    const products = await Product.find({})
    console.log(products)
    res.render('products/index', {products})
})

app.get('/products/new', (req, res) =>{
    throw new AppError("NOT ALLOWED", 401);
    res.render('products/new')
})

app.post('/products', async (req,res)=>{
    const newProduct = new Product(req.body)
    await newProduct.save()
    console.log(newProduct)
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req,res,next) =>{
    const {id} = req.params;
    const product = await Product.findById(id)
    if (!product) {
       return next(new AppError('Product not found', 404))
    }
    res.render('products/show', {product})
})

app.use((err, req, res, next) => {
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message)
})

app.listen(3000, ()=>{
    console.log("APP IS LISTENING ON PORT 3000!")
})