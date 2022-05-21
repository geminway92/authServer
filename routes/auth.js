const {  Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUser, validarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear un nuevo usuario
router.post( '/new',  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6}),
    validarCampos
], crearUsuario );

//Login un nuevo usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
] , loginUser );

//Validar y revalidar token
router.get( '/renew', validarJWT , validarToken );


module.exports = router;