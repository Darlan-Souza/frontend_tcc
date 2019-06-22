module.exports = {
    logado: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Você deve estar logado para acessar!")
        res.redirect("/")
    }
}