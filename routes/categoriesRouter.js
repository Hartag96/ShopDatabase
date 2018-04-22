const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const Products = require('../models/products');
const Categories = require('../models/categories');

const categoriesList = (category) => {
    var categories = (category === undefined) ?  Categories.find() : Categories.findOne({ name: category });
    return categories.populate('products').exec();
}


const router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.route('/')
.get((req, res, next) => {
    categoriesList().then((categories) => {
        res.render('categories', { title: 'Kategorie produktów', categories: categories})
    })
})
router.route('/:cat')
.get((req, res, next) => {
    categoriesList(req.params.cat).then((categoryProducts) => {
        console.log(categoryProducts);
        res.render('products', { title: 'Kategorie produktów', products: categoryProducts.products})
    })
})
module.exports = router;
