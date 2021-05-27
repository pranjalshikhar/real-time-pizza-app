const cartController = () => {
    return {
        cart(req, res) {
            res.render('customer/cart');
        }
    }
}

module.exports = cartController;