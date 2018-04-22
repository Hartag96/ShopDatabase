const bodyParser = require('body-parser');
const multer = require('multer');
const Products = require('./models/products');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/products');
    },


    filename: (req, file, cb) => {
        let filename = Math.random().toString(36).substr(2, 4) + Date.now() +
            file.originalname.substr(file.originalname.lastIndexOf("."));
        if (req.body.images === undefined) req.body.images = [filename];
        else req.body.images.push(filename);
        console.log('nazwa pliku ' + filename);
        cb(null, filename);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You canupload only images files!'), false);
    }
    cb(null, true);
}

const upload = multer({
        storage: storage,
        fileFilter: imageFileFilter
    })
    .array('images', 5);

module.exports = upload;
