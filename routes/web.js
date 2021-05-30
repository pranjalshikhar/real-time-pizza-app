const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController')

// Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


const initRoutes = (app) => {

    // Home Page
    app.get('/', homeController().index)

    // Login-Register-Logout
    app.get('/login', authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    // Cart Page
    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)

    // Customer Routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)

    // Admin Routes
    app.get('/admin/orders', admin, adminOrderController().index)

    // Admin Order Status
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes;