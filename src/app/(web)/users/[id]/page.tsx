import { getUserBookings, getUserData } from "@/libs/apis";

import Image from "next/image";
import LogoutButton from "@/components/user-components/logout-button/logout-button";
import UserMainTabs from "@/components/user-components/user-main-tabs";

export default async function UserDetails({ params }: { params: { id: string } }) {
  const userId = params.id;

  // Obtener datos del servidor
  const [userBookings, userData] = await Promise.all([
    getUserBookings(userId),
    getUserData(userId),
  ]);

  if (!userBookings || !userData) {
    return <div>Error loading user data</div>;
  }



  return (
    <div className="container mx-auto px-2 md:px-4 py-10">
      <div className="grid md:grid-cols-12 gap-10">
        {/* Información del usuario */}
        <div className=" md:block md:col-span-4 lg:col-span-3 shadow-lg p-4 dark:bg-black bg-white rounded-lg">
          <div className="sticky top-20">
            <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt={`Imagen de perfil de ${userData.name}`}
                  width={143}
                  height={143}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>
            <h6 className="text-xl font-bold text-center">{userData.name}</h6>
            <p className="text-center text-sm">{userData.about ?? "Sin descripción disponible"}</p>
            <p className="text-center text-xs text-gray-500 py-2">
              Te uniste el: {new Date(userData._createdAt).toLocaleDateString("es-ES")}
            </p>
            <div className="mt-5">
              <p className="text-sm">
                <span className="font-bold">Nombre:</span> {userData?.name ? userData?.name: "No disponible"}
              </p>
              <p className="text-sm">
                <span className="font-bold">Email:</span> {userData.email ? userData?.email: "No disponible"}
              </p>
              
            <LogoutButton />
            </div>

          </div>
          <div>
            {/* Otros detalles del usuario */}
        
          </div>

        </div>

        {/* Contenido principal */}
        <div className="md:col-span-8 lg:col-span-9">
          {/* Pestañas de pedidos */}
          <UserMainTabs dataPedidos={userBookings} userData={userData}/>
        </div>
      </div>
    </div>
  );
}
