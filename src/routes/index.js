const router = require('express').Router();
const faker = require('faker');
const request = require('request');
// obtenemos el modelo de mongodb
const Product = require('../models/product');

//metodo para obtener terminos de la API snomed y mostrarlos
const getSnomed = async(req, res) => {
    const termino = req.params.term;
    // si el término tiene espacios formateo el termino
    const termino_formateado = termino.replace(/\s/g,"%20");
    // url = 'https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-ES/2019-10-31/descriptions?&limit=100&term=neumon%C3%ADa%20neumoc%C3%B3cica&active=true&conceptActive=true&lang=english';
    url = 'https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-ES/2019-10-31/descriptions?&limit=100&term=' + termino_formateado + '&active=true&conceptActive=true&lang=english';
    
    request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        var itemsTerm = '';
        //convertir json a js
            
        body = JSON.parse(body);
        if(body.totalElements > 0 ){
            itemsTerm = body.items;
            //envio a la vista
            res.render('snomed/term', {
                itemsTerm,
                // current: page,
                // pages: Math.ceil(count / perPage)
            });
            // console.log(body.items[0].term)
            
            // body['items'].forEach(item => {
            //     console.log(' items term ' + item.term + ' item activo ' + item.active + "\n");
            // }); 
        // console.log(JSON.parse(body));
        }else{
            res.redirect('/snomed/');
        }
        
    });
}

// busca por termino al pasar el parametro /termino
// ejemplo http://localhost:3000/snomed/banana
router.get('/snomed/:term', getSnomed);

// al dar click en el boton snomed muestra el formulario para buscar termino
router.get('/snomed/', (req, res) => {
    termino = req;
    // console.log(termino);
    res.render('snomed/busca-term');
});

// rutas
router.get('/', (req, res) => {
    //vista views/index.ejs
    res.render('index');
});

router.get('/add-product', (req, res) => {
    res.render('products/add-product');
});

// guardar
router.post('/add-product', (req, res) => {
    const product = new Product();
    product.category = req.body.category_name;
    product.name = req.body.product_name;
    product.price = req.body.product_price;
    product.cover = faker.image.image();
    product.save(err => {
        if (err) return next(err);
        res.redirect('/add-product');
    });
});

// paginación
router.get('/products/:page', (req, res, next) => {
    let perPage = 9;
    let page = req.params.page || 1;
    
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, products) => {
            Product.countDocuments((err, count) => {
                if (err) return next(err);
                res.render('products/products', {
                    products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            });
        });
});

//ruta para generar datos aleatorios
router.get('/generate-fake-data', (req, res) => {
    for(let i = 0; i < 90; i++){
        const product = new Product();
        //generar 89 categorias al azar
        product.category = faker.commerce.department();
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.cover = faker.image.image();
        product.save(err => {
            if (err) { return next(err); }
        });
    }
    res.redirect('/add-product');
});

module.exports = router;