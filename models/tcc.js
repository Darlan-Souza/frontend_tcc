const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const Tcc = new Schema({
    titulo:{
        type: String,
        required: true
    },

    tema:{
        type: String,
        required: true
    },

    assunto:{
        type: String,
        default: Date.now()
    },

    resumo:{
        type: String,
        required: true
    },

    orientador:{
        type: String,
        required: true
    },

    orientando:{
        type: String,
        required: true
    },

    local:{
        type: String,
        required: true
    },
    membros:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        required: true
    }    
})

mongoose.model("trabalhos",Tcc)