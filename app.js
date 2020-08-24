const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
require('dotenv/config');

app.use(bodyParser.json());

app.use(cors());

app.post('/ad', async(req, res) => {

    // Validation
    const schema = Joi.object({
      price: Joi.number().required(),
      description: Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if(error) return res.status(422).send(error.details[0].message);

    const price = req.body.price;
    const description = req.body.description;

    // Start
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Events
    page.on('load', () => console.log('Loaded: ' + page.url()));

    await page.setDefaultNavigationTimeout(0); 

    // Navigate to home page
    await page.goto('https://www.seminuevos.com/');
    console.log('Currently on home page');

    // Navigate to login page
    await page.evaluate(() => { document.querySelector('a.login-btn').click(); });
    await page.waitForNavigation({waitUntil: 'load'});
    console.log('Currently on login page');

    // Fill / Submit Login Form
    await page.type('#email_login', process.env.SEMINUEVOS_USERNAME);
    await page.type('#password_login', process.env.SEMINUEVOS_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({waitUntil: 'load'});
    console.log('Currently on home page, but signed in');

    // Navigate to ad publish wizard
    await page.evaluate(() => { document.querySelector('.cta-btn > a').click(); });
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Currently on ad publish wizard page');

    //
    // Fill in the Wizard form
    // ---------------------------

    // Tipo: Autos - dropdown_types - autos
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_types]').click(); });
    await page.waitForSelector('#dropdown_types > div > div > ul > li[data-content="autos"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_types > div > div > ul > li[data-content="autos"] > a:first-child').click() });
  
    await page.waitFor(500);

    console.log('Selected: Tipo de auto')

    // Marca: Acura - dropdown_brands - acura
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_brands]').click(); });
    await page.waitForSelector('#dropdown_brands > div > div > ul > li[data-content="acura"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_brands > div > div > ul > li[data-content="acura"] > a:first-child').click() });

    await page.waitFor(500);

    console.log('Selected: Marca')

    // Modelo: ILX - dropdown_models - ilx
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_models]').click(); });
    await page.waitForSelector('#dropdown_models > div > div > ul > li[data-content="ilx"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_models > div > div > ul > li[data-content="ilx"] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Modelo')
    
    // Subtipo: Sedán - dropdown_subtypes - sedan
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_subtypes]').click(); });
    await page.waitForSelector('#dropdown_subtypes > div > div > ul > li[data-content="sedan"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_subtypes > div > div > ul > li[data-content="sedan"] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Subtipo')

    // Año: 2018 - dropdown_years - 2018
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_years]').click(); });
    await page.waitForSelector('#dropdown_years > div > div > ul > li[data-content="2018"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_years > div > div > ul > li[data-content="2018"] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Año')

    // Estado: Nuevo León - dropdown_provinces - nuevo leon
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_provinces]').click(); });
    await page.waitForSelector('#dropdown_provinces > div > div > ul > li[data-content="nuevo leon"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_provinces > div > div > ul > li[data-content="nuevo leon"] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Estado')

    // Ciudad/Delegación: Monterrey - dropdown_cities - monterrey
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_cities]').click(); });
    await page.waitForSelector('#dropdown_cities > div > div > ul > li[data-content="monterrey"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_cities > div > div > ul > li[data-content="monterrey"] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Ciudad/Delegacion')

    // Recorrido: 20000 kms - input_recorrido - dropdown_mileageType - kms.
    await page.type('#input_recorrido', '20000');
    console.log('Typed:    Recorrido')

    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_mileageType]').click(); });
    await page.waitForSelector('#dropdown_mileageType > div > div > ul > li[data-content="kms."] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_mileageType > div > div > ul > li[data-content="kms."] > a:first-child').click() });
    
    await page.waitFor(500);

    console.log('Selected: Recorrido')

    // Precio: [INPUT DE USUARIO]
    await page.type('#input_precio', price);
    console.log('Typed:    Precio');

    // Transacción: Negociable - dropdown_negotiable - negociable
    await page.evaluate(() => { document.querySelector('a[data-activates=dropdown_negotiable]').click(); });
    await page.waitForSelector('#dropdown_negotiable > div > div > ul > li[data-content="negociable"] > a:first-child');
    await page.evaluate(() => { document.querySelector('#dropdown_negotiable > div > div > ul > li[data-content="negociable"] > a:first-child').click() });
    console.log('Selected: Transacción');
    await page.waitFor(5000);
    
    // Navigate to next page
    await page.evaluate(() => { document.querySelector('.next-button').click(); });
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    console.log('Currently on second ad publish wizard page');

    await page.waitFor(3000);
    
    // Descripción: [INPUT DE USUARIO] - input_text_area_review
    await page.type('#input_text_area_review', description);
    console.log('Typed:    Descripcion');
    
    // Imágenes: Sube 3 fotos, las que sean.
    await page.waitForSelector('input[type="file"]');
    await page.waitFor(1000);
    const input = await page.$('input[type="file"]');
    await input.uploadFile('./images/car-1.jpg');
    await page.waitFor(2000);
    console.log('Uploaded File');
    await input.uploadFile('./images/car-2.jpg');
    await page.waitFor(2000);
    console.log('Uploaded File');
    await input.uploadFile('./images/car-3.jpg');
    await page.waitFor(2000);
    console.log('Uploaded File');
    await page.waitFor(2000);

    // Navigate to plan types page
    await page.waitForSelector('.next-button:not(.back)');
    await page.evaluate(() => { document.querySelector('.next-button:not(.back)').click() });
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('Currently on pricing plans page');    

    // Select free plan
    await page.evaluate(() => { document.querySelector('a#cancelButton').click(); });
    await page.waitFor(1000);
    console.log('Currently showing ad');

    // Get a screenshot of the current page
    const screenshot = await page.screenshot({path: 'screenshot.png', fullPage: true});

    // Close the Browser
    await browser.close();
    console.log('Browser closed, screenshot taken');
    
    res.set({'Content-Type': 'image/png'});
    res.json({ 
      screenshot: screenshot.toString('base64')
    });

});

app.listen(8000, () => console.log('Listening on port 8000'))