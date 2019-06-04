/*GUARDA TODAS AS ROTAS DE ADMIN*/
const express = require('express')
//Router() é usado para criar rotas em arquivos separados
const router = express.Router()

router.get('/', function (req, res) {
    res.render('admin/index')
})

module.exports = router