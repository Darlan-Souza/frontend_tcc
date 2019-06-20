const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/tcc")
const Trabalho = mongoose.model("trabalhos")

//Sessão de cadastro de trabalhos
router.get('/exibir_todos', function(req, res){
  Trabalho.find().sort({date:'desc'}).then((trabalhos)=>{
    res.render("tcc/exibir_todos",{trabalhos: trabalhos})
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro ao listar as categorias")
    res.redirect("/tcc")
  })
})

router.get('/cadastro',(req,res)=>{
  res.render("tcc/cadastro")
})

router.post('/cadastro/novo', (req, res)=>{
     
    const novoTrabalho = {
      titulo:req.body.titulo,
      tema:req.body.tema,
      assunto:req.body.assunto,
      resumo:req.body.resumo,
      orientador:req.body.orientador,
      orientando:req.body.orientando,
      local:req.body.local,
      membros:req.body.membros,
      data:req.body.data
    }
  
    new Trabalho(novoTrabalho).save().then(()=>{
      //Passando a mensagem para a variavel global
      req.flash("success_msg","Categoria criada com sucesso!")
      res.redirect("/tcc/exibir_todos")
    }).catch((err)=>{
      //Passando a mensagem para a variavel global
      req.flash("error_msg","Houve um erro ao salvar a categoria, tente novamente!"+err)
      res.redirect("/tcc/exibir_todos")
    })
  })

router.get('/index', function (req, res) {
    res.render("tcc/index")
})

//Sempre fica por ultimo
module.exports = router 