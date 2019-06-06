const express = require("express")
const router = express.Router()

router.get('/exibir_todos', function(req, res){
    res.render("tcc/exibir_todos")
})

router.get('/cadastro', function (req, res) {
    res.render("tcc/cadastro")
})
router.get('/index', function (req, res) {
    res.render("tcc/index")
})

//Sempre fica por ultimo
module.exports = router 