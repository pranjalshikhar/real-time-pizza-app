const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
// const admin = require('../app/http/middlewares/admin')

const initRoutes = (app) => {

    app.get('/', homeController().index)

    app.get('/login', authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)

    // Customer Routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)

    // Admin Routes
    app.get('/admin/orders', auth, adminOrderController().index)
}

module.exports = initRoutes;