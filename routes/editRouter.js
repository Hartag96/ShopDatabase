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

const updateCategories = (product, req) => {
    return new Promise((resolve, reject) => {
        if (req.body.category !== product.category.name) {

            Categories.findOneAndUpdate({
                    'name': product.category.name
                }, {
                    $pull: {
                        products: req.body.id
                    }
                })
                .then((cat) => {
                    Categories.findOneAndUpdate({
                            'name': req.body.category
                        }, {
                            $push: {
                                products: req.body.id
                            }
                        })
                        .then((updatedCat) => {
                            resolve(updatedCat.id);
                        }, (err) => next(err))
                }, (err) => next(err))
        } else {
            resolve(false);
        }
    })
}

const router = express.Router();
router.use(expressValidator())
router.use(bodyParser.json());
/* GET users listing. */
router.route('/')
    .get((req, res, next) => {
        res.render('index', {
            title: `Edycja produktu`
        });
    })
    .post(upload, (req, res, next) => {
        req.checkBody('name', 'nazwa na ktrótka').isLength({
            min: 3
        })
        req.checkBody('price1', 'Niepoprawna kwota Cena-1').isCurrency();
        req.checkBody('price2', 'Niepoprawna kwota Cena-2').isCurrency();
        req.checkBody('price3', 'Niepoprawna kwota Cena-3').isCurrency();
        req.checkBody('quantity', 'Niewłaściwa ilość towaru').isInt();
        req.checkBody('available', 'Bład wartość logicznej Dostęności').isBoolean();
        let errors = req.validationErrors();
        if (errors) {
            Products.findById(req.body.id)
                .populate('category', 'name')
                .then((product) => {
                    if (req.body.images) {
                        req.body.images.forEach((img) => {
                            console.log(img);
                            fs.unlinkSync('./public/images/products/' + img)
                        });
                    }
                    req.body.images = product.images; // req.body.images przychodzi puste z formularza
                    req.body.available = product.available
                    categoriesList()
                        .then((categories) => {
                            res.render('edit', {
                                title: `Bład przy edycji productu`,
                                product: req.body, // wysyla to samo co przyslal uzytkownik
                                categories: categories,
                                succes: false,
                                errors: errors
                            });

                        }, (err) => next(err))
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            let productToUpdate = Products.findById(req.body.id).populate('category');
            productToUpdate
                .then((product) => {
                    if (req.body.images !== undefined) {
                        req.body.images.forEach((img) => {
                            product.images.push(img);
                        })
                    };
                    if (req.body.imagesToDelete !== undefined) {
                        let imagesToDelete = req.body.imagesToDelete;
                        imagesToDelete = imagesToDelete.split(",").filter(Boolean); // Boolean odtraca puste ("") elementy
                        imagesToDelete.forEach((img) => {
                            let index = product.images.indexOf(img);
                            if (index !== -1) {
                                product.images.splice(index, 1);
                                fs.unlinkSync('./public/images/products/' + img);
                            }
                        })
                    }

                    updateCategories(product, req)
                        .then((catUpdated) => {
                            if (catUpdated) // Jezeli kategoria zostala zmieniona
                                product.category = catUpdated;

                            product.name = req.body.name;
                            product.price1 = req.body.price1;
                            product.price2 = req.body.price2;
                            product.price3 = req.body.price3;
                            product.quantity = req.body.quantity;
                            product.available = req.body.available;
                            product.save()
                                .then((product) => {
                                    console.log('zapisuje', product.name);
                                    res.redirect("/product/" + product.id);
                                }, (err) => next(err))
                        }, (err) => next(err))
                }, (err) => next(err))
                .catch((err) => next(err));
        }
    });

router.route('/:productID')
    .get((req, res, next) => {

        Products.findById(req.params.productID).populate('category', 'name')
            .then((product) => {
                categoriesList()
                    .then((categories) => {
                        console.log('ok');
                        res.render('edit', {
                            title: `Edycja produktu`,
                            product: product,
                            categories: categories
                        })
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = router;
