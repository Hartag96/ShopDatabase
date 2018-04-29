const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
router.use(bodyParser.json());

const Products = require('../models/products');
const Categories = require('../models/categories');

const categoriesList = () => {
    var categories = Categories.find().exec();
    return categories;
}

/* GET home page. */
router.route('/')
    .get((req, res, next) => {
        let regexp;
        req.query.search !== undefined ? regexp = new RegExp(req.query.search, 'i') : regexp = new RegExp();
        Products.find({
                name: regexp
            }).sort(req.query.sort)
            .populate('category', 'name')
            .then((products) => {
                res.render('products', {
                    title: 'Baza danych M-car',
                    products: products,
                    searchQuery: req.query.search
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        req.checkBody('name', 'nazwa na ktrótka').isLength({
            min: 3
        })
        req.checkBody('price1', 'Niepoprawna kwota Cena-1').isCurrency();
        req.checkBody('price2', 'Niepoprawna kwota Cena-2').isCurrency();
        req.checkBody('price3', 'Niepoprawna kwota Cena-3').isCurrency();
        req.checkBody('quantity', 'Niewłaściwa ilość towaru').isInt();

        let errors = req.validationErrors();
        if (errors) {
            res.render('create', {
                succes: false,
                errors: errors
            });
        } else {
            res.render('create', {
                succes: true
            })
        }
    })

router.route('/:productID')
    .get((req, res, next) => {
        Products.findById(req.params.productID)
            .populate('category', 'name')
            .then((product) => {
                res.render('product', {
                    title: `Produkt`,
                    product: product
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        Products.findByIdAndUpdate(req.params.productID, {
                $set: req.body
            }, {
                new: true
            })
            .then((product) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Categories.findOne({
                'products': req.params.productID
            })
            .then((cat) => {
                cat.products.splice(cat.products.indexOf(req.params.productID), 1);
                cat.save()
                    .then((updatedCat) => {
                        Products.findById(req.params.productID)
                            .then((product) => {
                                if (product.images) {
                                    product.images.forEach((img) => {
                                        let imgPath = path.join('public', 'images', 'products', img);
                                        fs.unlinkSync(imgPath)
                                    });
                                }
                                product.remove()
                                    .then((resp) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(resp);
                                    }, (err) => next(err))
                            }, (err) => next(err))
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));

    })

module.exports = router;
