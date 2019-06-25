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

    orientando:{
        type: String,
        required: true
    },

    orientador:{
        type: String,
        required: true
    },

    horario:{
        type: String,
        required: false
    },

    local:{
        type: String,
        required: true
    },

    data:{
        type: {$dateToString: {format: "%G-%m-%d",date: "$datetime"}},
        required: true
    },

    membros:{
        type: String,
        required: true
    },

    documento:{
        type: String,
        required: true
    }
})

mongoose.model("trabalhos",Tcc)