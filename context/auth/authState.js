import React, { useReducer } from "react";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import {
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    LIMPIAR_ALERTA,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
} from "../../types"
import clienteAxios from "../../config/axios"
import tokenAuth from "../../config/tokenAuth";

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

    //una funcion que nos retorne un usuario autenticado en base al JWT
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            tokenAuth(token)
        }

        try {
            const respuesta = await clienteAxios.get("/api/auth");
            dispatch({
                type: USUARIO_AUTENTICADO,
                payload: respuesta.data.usuario
            })
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    //cerrar Sesion
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }

    return (
        <AuthContext.Provider value={{
            token: state.token,
            autenticado: state.autenticado,
            usuario: state.usuario,
            mensaje: state.mensaje,
            registrarUsuarios,
            iniciarSesion,
            usuarioAutenticado,
            cerrarSesion


        }} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthState;