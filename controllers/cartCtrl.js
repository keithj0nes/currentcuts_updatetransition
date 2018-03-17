module.exports = {
  addToCart: function(req, res){
    if(!req.session.cart){
      req.session.cart = [];
    }
    req.session.cart.push(req.body);
    return res.send(req.session.cart);
  },

  getCart: function(req, res){
    return res.send(req.session.cart);
  },

  deleteInCart: function(req, res){
    req.session.cart.splice(req.params.id, 1);
    return res.send(req.session.cart);
  },

  updateCart: function(req, res){
    req.session.cart = req.body;
    return res.send(req.session.cart);
  }
}
