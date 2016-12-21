module.exports = {

  getAllProducts: function(req, res, next){
    // db.get_all([], function(err, response){
    //
    // })
    console.log("products shown");
    res.send("All of the products")
  },

  getProductById: function(req, res, send){
    console.log("Specific item");
  },

  addPost: function(req, res, next){
    console.log("post is wanted lol");
    res.send("HERE IS TEXT")
  },








}
