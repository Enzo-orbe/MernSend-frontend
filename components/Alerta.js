import React, { useContext } from 'react'
import AuthContext from "../context/auth/authContext";
import AppContext from "../context/app/appContext";


export default function Alerta() {

    //acceder al state 
    const authContext = useContext(AuthContext);
    const { mensaje } = authContext;

    //acceder al state de app
    const appContext = useContext(AppContext);
    const { mensaje_archivo } = appContext;

    return (
        <div className="bg-red-500 py-2 px-3 w-full my-3 max-w-lg text-center text-white mx-auto">
            {mensaje || mensaje_archivo}
        </div>
    )
}
