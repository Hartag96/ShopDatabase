const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const expressValidator = require('express-validator');
const Products = require('../models/products');
const Categories = require('../models/categories');
const upload = require('../imagesFiles');


const categoriesList = () => {
    var categories = Categories.find().populate('category').exec();
    return categories;
}

const router = express.Router();
router.use(expressValidator());
router.use(bodyParser.json());
/* GET users listing. */
router.route('/')
    .get((req, res, next) => {
        categoriesList().then((categories) => {
            res.render('create', {
                title: 'Dodawanie elementu',
                categories: categories
            })
        }, (err) => next(err))
    })

    .post(upload, (req, res, next) => {
        req.checkBody('name', 'nazwa na ktrótka').isLength({
            min: 3
        })
        req.checkBody('price1', 'Niepoprawna kwota Cena-1').isCurrency();
        req.checkBody('price2', 'Niepoprawna kwota Cena-2').isCurrency();
        req.checkBody('price3', 'Niepoprawna kwota Cena-3').isCurrency();
        req.checkBody('quantity', 'Niewłaściwa ilość towaru').isInt();
        let errors = req.validationErrors();
        if (errors) {
            req.body.images.forEach((img) => { // usuwanie uploadowanych plikow
                let imgPath = path.join(__dirname, 'public', 'images', 'products', img);
                fs.unlinkSync(imgPath)
            })
            categoriesList()
                .then((categories) => {
                    res.render('create', {
                        title: 'Dodawanie elementu',
                        categories: categories,
                        succes: false,
                        errors: errors,
                        product: req.body
                    });
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            Categories.findOne({
                    name: req.body.category
                })
                .then((cat) => {
                    req.body.category = cat.id;
                    Products.create(req.body)
                        .then((product) => {
                            Categories.findByIdAndUpdate(cat.id, {
                                    $push: {
                                        products: product.id
                                    }
                                })
                                .then((updatedCat) => {

                                    categoriesList()
                                        .then((categories) => {
                                            res.render('create', {
                                                title: 'Dodawanie elementu',
                                                categories: categories,
                                                productID: product.id,
                                                productName: product.name,
                                                succes: true
                                            });
                                        }, (err) => next(err))
                                }, (err) => next(err))
                        }, (err) => next(err))
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    })
module.exports = router;
