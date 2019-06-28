const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    eAdmin:{
        type: Number,
        default:0
    },
    
    senha:{
        type: String,
        required: true
    }    
})

mongoose.model("usuarios",Usuario)

//Função para criar um administrador
//db.usuarios.insert({"nome": "Gilberto","email": "gilberto@gmail.com", "eAdmin": 1, "senha":12345678}) 

//Modificar eAdmin
//db.usuarios.update({'nome':'Gilberto'},{$set:{'eAdmin':1}})