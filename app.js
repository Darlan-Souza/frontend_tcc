/*CARREGANDO MODULOS*/
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    //o módulo path serve para manipulação de pastas
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const usuarios = require("./routes/usuario")

/*CONFIGURAÇÕES*/
    //Sessão
        //app.use = serve para criação e configuração de midlewares
        app.use(session({
            //chave que gera sessão
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    
    //Midleware
        app.use(function(req, res, next){
            //crio variáveis globais
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
        
    //body-parser 
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))  
        app.set('view engine', 'handlebars')
    //Mongoose


    //Public 
        /*Falando para o express que a pasta public que contém os arquivos estáticos*/
        //__dirname paga o caminho absoluto para a pasta public 
        app.use(express.static(path.join(__dirname, 'public')))

        //criando um MIDDLEWARES USADO PARA AUTENTICAÇÃO
        app.use(function(req, res, next){
            console.log("Eu sou um midleware!")
            //tenho que carregar este 'next' por que se não a pagina vai tracar nesta parte e ficar carregando para sempre
            next()
        })
       
/*ROTAS*/
    app.get("/", function(req, res){
            res.render("index")       
    })

    app.get("/404", function(req, res){
        res.send("Erro 404!")
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

/*OUTROS*/
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando na porta 8081!")
})