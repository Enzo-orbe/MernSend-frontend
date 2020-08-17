import React, { useReducer } from "react";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import { REGISTRO_EXITOSO, REGISTRO_ERROR, LIMPIAR_ALERTA, LOGIN_EXITOSO, LOGIN_ERROR } from "../../types"
import clienteAxios from "../../config/axios"

const AuthState = ({ children }) => {
    //Definir un state inicial 
    const initialState = {
        token: typeof window !== "undefined" ? localStorage.getItem("token") : "",
        autenticado: null,
        usuario: null,
        mensaje: null,
    }

    //definir el reducer
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    //registrar nuevos usuarios
    const registrarUsuarios = async datos => {
        try {
            const respuesta = await clienteAxios.post("/api/usuarios", datos);
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            })
        } catch (error) {
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })
        }
        //limpia la alerta despues de 3 segundos
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,
            })
        }, 3000);
    }

    //Autenticar usuarios
    const iniciarSesion = async (datos) => {
        try {
            const respuesta = await clienteAxios.post("/api/auth", datos)
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
        //limpia la alerta despues de 3 segundos
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA,
            })
        }, 3000);
    }

    //funcion que nos da un usuario autenticado
    const usuarioAutenticado = nombre => {
        dispatch({
            type: USUARIO_AUTENTICADO,
            payload: nombre
        })
    }

    return (
        <AuthContext.Provider value={{
            token: state.token,
            autenticado: state.autenticado,
            usuario: state.usuario,
            mensaje: state.mensaje,
            registrarUsuarios,
            usuarioAutenticado,
            iniciarSesion


        }} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthState;