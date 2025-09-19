"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { HiEye, HiEyeOff } from "react-icons/hi";

const defaultFormData = {
  email: "",
  name: "",
  password: "",
  acceptDataTreatment: true,
};

const Auth = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const searchParams = useSearchParams();
  const isPagarForm = searchParams.get("form") === "pagar";
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const inputStyles =
    "border border-gray-300 dark:border-gray-700 sm:text-sm text-black dark:text-white bg-white dark:bg-black rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all placeholder-gray-400 dark:placeholder-gray-500";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Show policy acceptance toast
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Políticas de Tratamiento de Datos
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Al continuar, aceptas nuestras políticas de tratamiento de datos.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                const redirectPath = isPagarForm ? "/pagar" : "/";
                router.push(redirectPath);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Aceptar
            </button>
          </div>
        </div>
      ));
    }
  }, [session, isPagarForm, router]);

  const loginHandler = async () => {
    try {
      await signIn("google", {
        callbackUrl: isPagarForm ? "/pagar" : "/",
      });
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      const user = await signUp(formData);
      if (user) {
        toast.success("Éxito. Por favor inicia sesión");
        setIsLogin(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Algo salió mal");
    } finally {
      setFormData(defaultFormData);
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto min-h-[80vh] flex items-center justify-center transition-colors">
      <Toaster position="top-center" />
      <div className="rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-md border border-gray-200 dark:border-gray-800">
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            className={`flex-1 py-2 rounded-l-2xl text-lg font-semibold transition-all ${isLogin ? "bg-black text-white" : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300"}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Iniciar Sesión
          </button>
          <button
            className={`flex-1 py-2 rounded-r-2xl text-lg font-semibold transition-all ${!isLogin ? "bg-black text-white" : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300"}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Crear Cuenta
          </button>
        </div>
        {/* Google Button */}
        <button
          onClick={loginHandler}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 rounded-lg py-2 mb-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all shadow-sm text-black dark:text-white"
        >
          <FcGoogle className="text-2xl" />
          <span className="font-medium">Continuar con Google</span>
        </button>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            className={inputStyles}
            value={formData.email}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
              className={inputStyles}
              value={formData.name}
              onChange={handleInputChange}
            />
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              required
              minLength={6}
              className={inputStyles + " pr-12"}
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 dark:text-gray-300 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>
          {!isLogin && (
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="acceptDataTreatment"
                id="acceptDataTreatment"
                checked={formData.acceptDataTreatment}
                onChange={(e) => setFormData({ ...formData, acceptDataTreatment: e.target.checked })}
                className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
              />
              <label htmlFor="acceptDataTreatment" className="text-sm text-gray-500">
                Acepto el{" "}
                <a
                  href="/tyc"
                  target="_blank"
                  className="text-black dark:text-white underline hover:text-gray-600"
                >
                  tratamiento de mis datos personales
                </a>{" "}
                para recibir información sobre productos, ofertas especiales y promociones de Fritz Sport. Puedo revocar este consentimiento en cualquier momento.
              </label>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 font-semibold rounded-lg py-2 transition-all disabled:opacity-60 border border-black dark:border-white flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Auth;