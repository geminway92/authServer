const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async ( req, res = response ) => {
  
    const {email, name, password } = req.body;
    
    try{

        // Verificar el email
        let usuario = await Usuario.findOne({ email })

        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            })
        }
        
        // Crear usuario con el modelo
        usuario = new Usuario( req.body )

        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password , salt );

        // Generar el JWT
        const token = await generarJWT( usuario.id, name );
    
        // Crear usuario de DB
        await usuario.save();

        // Generar respuesta exitosa

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name,
            token
        });
        
    }catch(error){
        console.log(error);

        return res.status(500).json({
            ok: true,
            msg: 'Por favor hable con el administrador'
        });
    }
    
 
   
}

const loginUser = async ( req, res = response ) => {

    const { email, password } = req.body;
    try{

        const usuario = await  Usuario.findOne( {email});

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar el password hace match
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id, usuario.name );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
   
    
}

const validarToken = async ( req, res = response ) => {

    
    const { uid, name } = req;
    const token = await generarJWT( uid, name );

    return res.json({
        ok: true,
        msg: 'Renew /',
        
    });
}


module.exports = {
    crearUsuario,
    loginUser,
    validarToken
}