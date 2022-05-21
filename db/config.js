const mongoose = require("mongoose");

const dbConection = async() => {

    try{

        await mongoose.connect( process.env.BD_CNN, {
            useUnifiedTopology: true,
        } )

        console.log('BD Online')

    }catch(error){
        console.log(error)
        throw new Error('Error a la hora de inicializar DB');
    }
}

module.exports = {
    dbConection
}