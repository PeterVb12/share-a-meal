const express = require('express')
const userRoutes = require('./src/routes/user.routes')
const authRoutes = require('./src/routes/authentication.routes')
const mealRoutes = require('./src/routes/meal.routes')
const logger = require('./src/util/logger')

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/api/info', (req, res) => {
    console.log('GET /api/info')
    const info = {
        name: 'My Nodejs Express server',
        version: '0.0.1',
        description: 'This is a simple Nodejs Express server'
    }
    res.json(info)
})

// Hier komen alle routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', mealRoutes)



// Route error handler
app.use((req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
})

// Hier komt je Express error handler te staan!
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {}
    })
})

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
})

// Deze export is nodig zodat Chai de server kan opstarten
module.exports = app