import React, { useContext, useEffect } from 'react'
import Link from "next/link";
import AuthContext from "../context/auth/authContext"
import AppContext from "../context/app/appContext"
import { useRouter } from "next/router"


export default function Header() {
    //Routing
    const router = useRouter();

    //Extraer el usuario autenticado del storage 
    const authContext = useContext(AuthContext);
    const { usuario, usuarioAutenticado, cerrarSesion } = authContext;

    //context app
    const appContext = useContext(AppContext);
    const { limpiarState } = appContext;

    useEffect(() => {
        usuarioAutenticado()
    }, [])

    const redireccionnar = () => {
        router.push("/");
        limpiarState();
    };

    return (
        <header className="py-8 flex flex-col md:flex-row items-center justify-between ">

            <img
                onClick={() => redireccionnar()}
                className="w-64 mb-8 md:mb-0 cursor-pointer" src="/logo.svg" />

            <div>
                {
                    usuario ? (
                        <div className="flex items-center">
                            <p className="mr-2">Hola {usuario.nombre}</p>
                            <button
                                className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase"
                                type="button"
                                onClick={() => cerrarSesion()}
                            >
                                Cerrar Sesion
                        </button>
                        </div>
                    ) : (
                            <>
                                <Link href="/login">
                                    <a className="bg-red-500 px-5 py-3 rounded-lg text-white font-bold uppercase mr-2">Iniciar Sesion</a>
                                </Link>
                                <Link href="/crearcuenta">
                                    <a className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase">Crear cuenta</a>
                                </Link>
                            </>
                        )
                }

            </div>
        </header>
    )
}
