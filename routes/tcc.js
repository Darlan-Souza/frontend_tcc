const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/tcc")
const Trabalho = mongoose.model("trabalhos")


//Sessão de cadastro de trabalhos
router.get('/exibir_todos', function(req, res){

const path = require("path")
const crypto = require("crypto")
const multer  = require("multer")
const GridFsStorage  = require("multer-gridfs-storage")
const Grid  = require("gridfs-stream")
const method  = require("method-override")


Grid.mongo = mongoose.mongo
const app = express()


//Init gfs
let gfs;


mongoose.connection.once('open', () =>{
    gfs = Grid(mongoose.connection.db, mongoose.mongo)
    gfs.collection('upload')
    // all set!
  })

//Store engine
const storage = new GridFsStorage({
    url: 'mongodb://localhost/tcc',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'upload'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

//exibe os documentos
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


router.get('/cadastro',(req,res)=>{
  res.render("tcc/cadastro")
})

router.post('/cadastro/novo', (req, res)=>{

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
router.get('/cadastro', eAdmin,(req,res)=>{
  res.render("tcc/cadastro")
})

router.post('/cadastro/novo', eAdmin, upload.single('file'), (req, res)=>{

     
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

  //Editar tcc
  router.get("/cadastro/edit/:id",(req,res)=>{
    Trabalho.findOne({_id:req.params.id}).then((trabalho)=>{
      res.render("tcc/editar",{trabalho: trabalho})
      }).catch((err)=>{
        req.flash("error_msg","Este trabalho não existe!")
        res.redirect("/tcc/exibir_todos")
      })
  })

  router.post("/cadastro/edit",(req,res)=>{
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

  router.post("/cadastro/deletar", (req, res) => {
    Trabalho.remove({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Trabalho deletado com sucesso!")
      res.redirect("/tcc/exibir_todos")
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar o trabalho!")
      res.redirect("/tcc/exibir_todos")
    })
  })



router.get('/index', function (req, res) {
    res.render("tcc/index")
})

  //Exibe arquivo
  router.get("/cadastro/exibeDoc/:_id",(req,res)=>{
    gfs.file.findOne({id : req.params._id},(file)=>{
      //Check if files
      if(!file || file.length == 0){
        res.flash("error_msg","Não existe arquivo cadastrado")
      }
      //Check if image
      if(file.contentType == 'application/pdf'){
        // Read output to browser
        const readstream = gfs.createReadStream(file._id);
        readstream.pipe(res);
      }else{
        res.flash("error_msg","Não existe pdf cadastrado")
      }
    })
  })
})})

//Sempre fica por ultimo
module.exports = router