const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/tcc")
const Trabalho = mongoose.model("trabalhos")
const {eAdmin} = require("../helpers/eAdmin")
const {logado} = require("../helpers/logado")


router.get('/documentacao',  (req,res)=>{
  res.render("tcc/documentacao")
})

//exibe todos os tccs
router.get('/exibir_todos',  (req, res)=>{
  Trabalho.find().sort({date:'desc'}).then((trabalhos)=>{
    res.render("tcc/exibir_todos",{trabalhos: trabalhos})
  }).catch((err)=>{
    req.flash("error_msg","Houve um erro ao listar as categorias")
    res.redirect("/tcc")
  })
})

//detalhes do tcc
router.get('/index/detalhe',  (req,res)=>{
  res.render("tcc/detalhe")
})

//pesquisa com filtro

router.get('/index',  (req,res)=>{
  res.render("tcc/index")
})

router.post('/index/p', (req, res)=>{
  if(req.body.filtro == "Tema"){
var pesquisa = req.body.pesquisa;
Trabalho.find({tema: new RegExp(pesquisa, 'i')}).sort({date:'desc'}).then((trabalhos)=>{
  res.render("tcc/index", {trabalhos:trabalhos})
}).catch((err)=>{
  req.flash("error_msg", "TCC não encontrado")
  res.redirect("/tcc")
})
}
if(req.body.filtro == "Orientador"){
  var pesquisa = req.body.pesquisa;
  Trabalho.find({orientador: new RegExp( pesquisa, 'i')}).sort({date:'desc'}).then((trabalhos)=>{
    res.render("tcc/index", {trabalhos:trabalhos})
  }).catch((err)=>{
    req.flash("error_msg", "TCC não encontrado")
    res.redirect("/tcc")
  })
  }
  if(req.body.filtro == "Aluno"){
    var pesquisa = req.body.pesquisa;
    Trabalho.find({orientando:  new RegExp(pesquisa, 'i')}).sort({date:'desc'}).then((trabalhos)=>{
      res.render("tcc/index", {trabalhos:trabalhos})
    }).catch((err)=>{
      req.flash("error_msg", "TCC não encontrado")
      res.redirect("/tcc")
    })
    }
  
    if(req.body.filtro == "Titulo"){
      var pesquisa = req.body.pesquisa;
      Trabalho.find({titulo:  new RegExp(pesquisa,'i')}).sort({date:'desc'}).then((trabalhos)=>{
        res.render("tcc/index", {trabalhos:trabalhos})
      }).catch((err)=>{
        req.flash("error_msg", "TCC não encontrado")
        res.redirect("/tcc")
      })
      }

})


//cadastro de trabalhos
router.get('/cadastro', eAdmin, (req,res)=>{
  res.render("tcc/cadastro")
})

router.post('/cadastro/novo', eAdmin, (req, res)=>{
     
    const novoTrabalho = {
      titulo:req.body.titulo,
      tema:req.body.tema,
      assunto:req.body.assunto,
      resumo:req.body.resumo,
      orientando:req.body.orientando,
      orientador:req.body.orientador,
      horario:req.body.horario,
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

  //Editar tcc
  router.get("/cadastro/edit/:id", eAdmin, (req,res)=>{
    Trabalho.findOne({_id:req.params.id}).then((trabalho)=>{
      res.render("tcc/editar",{trabalho: trabalho})
      }).catch((err)=>{
        req.flash("error_msg","Este trabalho não existe!")
        res.redirect("/tcc/exibir_todos")
      })
  })

  router.post("/cadastro/edit", eAdmin, (req,res)=>{
    Trabalho.findOne({_id: req.body.id}).then((trabalho)=>{
      
      trabalho.titulo = req.body.titulo,
      trabalho.tema = req.body.tema,
      trabalho.assunto = req.body.assunto,
      trabalho.resumo = req.body.resumo,
      trabalho.orientador = req.body.orientador,
      trabalho.orientando = req.body.orientando,
      trabalho.local = req.body.local,
      trabalho.membros = req.body.membros,
      trabalho.data = req.body.data

      trabalho.save().then(()=>{
        req.flash("success_msg","Trabalho editado com sucesso!")
        res.redirect("/tcc/exibir_todos")
      }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao salvar a edição do trabalho!")
        res.redirect("/tcc/exibir_todos")
      })

    }).catch((err)=>{
      req.flash("error_msg","Houve um erro ao editar o trabalho")
      res.redirect("/tcc/exibir_todos")
    })

  })
 

  //exibir detalhes
   router.get("/cadastro/exibe/:id",  (req,res)=>{
    Trabalho.findOne({_id:req.params.id}).then((trabalho)=>{
      res.render("tcc/detalhe",{trabalho: trabalho})
      }).catch((err)=>{
        req.flash("error_msg","Este trabalho não existe!")
        res.redirect("/tcc/exibir_todos")
      })
  })

  //deleta tcc
  router.post("/cadastro/deletar", eAdmin, (req, res) => {
    Trabalho.remove({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Trabalho deletado com sucesso!")
      res.redirect("/tcc/exibir_todos")
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar o trabalho!")
      res.redirect("/tcc/exibir_todos")
    })
  })



//Sempre fica por ultimo
module.exports = router 