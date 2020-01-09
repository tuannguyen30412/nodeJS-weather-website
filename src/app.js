const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// console.log(__dirname) //directory of the src folder
// console.log(__filename) //directory of app.js
// console.log(path.join(__dirname, '..')) //.. to go up 1 level of directory

const app = express()

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath) //pointing views to the customized dir
hbs.registerPartials(partialsPath)

//setup static dr to serve
app.use(express.static(publicDirectoryPath))

//index route
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Tuan Nguyen'
    }) //render handlebar the 'name' has to match up the name of handlebar in views folder
})

//about route
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Tuan Nguyen'
    })
})

//help route
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful texts',
        title: 'Help',
        name: 'Tuan Nguyen'
    })
})
//No need to use this because the static page declared above
// app.get('', (req, res) => {
//     //html response
//     // res.send('<h1>Weather</h1>') //send something back to the requester
//     res.send()
// })


// app.get('/help', (req, res) => {
//     //JSON response
//     // res.send({
//     //     name: 'Tuan',
//     //     age: 29
//     // })
// })

// app.get('/about', (req, res) => {
//     // res.send([{
//     //     name: 'Andrew',
//     //     age: 28
//     // }, {
//     //     name: 'Sarah',
//     //     age: 27
//     // }])
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        })
    }

    geocode(req.query.address, (error, {
        latitude,
        longitude,
        location
    } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Tuan Nguyen',
        errorMessage: 'Help article not found.'

    })
})
app.get('*', (req, res) => { //* matches everything that hasnt been matched bfore
    res.render('404', {
        title: '404',
        name: 'Tuan Nguyen',
        errorMessage: 'Page not found.'
    })
})

//start server up listen(portNumber) this server startup is asynchronous
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})

//domain: app.com 
//different pages:
//domain app.com/help
//app.com/about 