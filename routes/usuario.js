const express = require("express")
const router = express.Router()
const passport = require("passport")
const mongoose = require("mongoose")
require("../models/usuarios")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")


//sessão de cadastro de usuário
router.get('/registro',(req,res)=>{
    res.render("usuarios/registro")
  })
  
  router.post('/registro/novo', (req, res)=>{
      var erros = []

      if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
          erros.push({texto: "Nome inválido"})
      }

      if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"})
    }

    if(req.body.senha.length < 6){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }
    
    else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse email!")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:req.body.senha
                  })

                  bcrypt.genSalt(10, (erro, salt) => {
                      bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                          if(erro){
                              req.flash("error_msg", "Erro ao cadastrar usuário!")
                              res.redirect("/usuarios/registro")
                          }
                          novoUsuario.senha = hash
                          novoUsuario.save().then(() => {
                              req.flash("success_msg", "Usuário cadastrado com sucesso!")
                              res.redirect("/usuarios/login")
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

router.get('/index', function (req, res) {
    res.render("usuarios/index")
})

//sessão de login
router.get("/login", function (req, res) {
    res.render("usuarios/login")
})

router.post("/login/aut", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/tcc/exibir_todos",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

//usuario fazer logout do sistema 
router.get("/logout", function(req, res){
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

//Editar usuário
router.get("/registro/edit/:id", eAdmin, (req,res)=>{
    Usuario.findOne({_id:req.params.id}).then((usuario)=>{
      res.render("usuarios/editar",{usuario:usuario})
      }).catch((err)=>{
        req.flash("error_msg","Este usuário não existe!")
        res.redirect("/usuarios/exibir_todos")
      })
  })

  router.post("/registro/edit", eAdmin, (req,res)=>{
    Usuario.findOne({_id: req.body.id}).then((usuario)=>{
      
      usuario.nome = req.body.nome,
      usuario.email = req.body.email,
      usuario.senha = req.body.senha,

      usuario.save().then(()=>{
        req.flash("success_msg","Usuário editado com sucesso!")
        res.redirect("/usuarios/exibir_todos")
      }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao salvar a edição do usuário!")
        res.redirect("/usuarios/exibir_todos")
      })

    }).catch((err)=>{
      req.flash("error_msg","Houve um erro ao editar o usuário")
      res.redirect("/usuarios/exibir_todos")
    })

  })

  //deletar usuário
  router.post("/registro/deletar", eAdmin, (req, res) => {
    Trabalho.remove({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Usuário deletado com sucesso!")
      res.redirect("/usuarios/exibir_todos")
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar o usuário!")
      res.redirect("/usuarios/exibir_todos")
    })
  })

//Sempre fica por ultimo
module.exports = router 