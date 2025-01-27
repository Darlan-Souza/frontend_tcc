const express = require("express")
const router = express.Router()
const passport = require("passport")
const mongoose = require("mongoose")
require("../models/usuarios")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")


//sessão de cadastro de usuário
router.get('/registro', (req, res) => {
    res.render("usuarios/registro")
})

router.get('/index', function (req, res) {
    res.render("usuarios/index")
})

//sessão de login
router.get("/login", function (req, res) {
    res.render("usuarios/login")
})

router.get('/registro_aluno', function (req, res) {
    res.render("usuarios/registro_aluno")
})

router.get('/editar', function (req, res) {
    res.render("usuarios/editar")
})

router.get('/exibir_todos', function (req, res) {
    res.render("usuarios/exibir_todos")
})


router.post('/registro/novo', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email inválido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida" })
    }

    if (req.body.senha.length < 6) {
        erros.push({ texto: "Senha muito curta" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente!" })
    }

    if (erros.length > 0) {
        res.render("usuarios/registro", { erros: erros })
    }

    else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com esse email!")
                res.redirect("/usuarios/registro")
            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Erro ao cadastrar usuário!")
                            res.redirect("/usuarios/registro")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário cadastrado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }


})

router.post("/login/aut", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/usuarios/index",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

//usuario fazer logout do sistema 
router.get("/logout", function (req, res) {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/")
})

//Sempre fica por ultimo
module.exports = router 