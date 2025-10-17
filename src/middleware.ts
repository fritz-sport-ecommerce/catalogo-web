import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getMaintenanceMode } from "./utils/maintence-mode-cache";

async function fetchMaintenanceMode() {
  const data = await client.fetch(
    groq`*[_type == "catalogo"][0]{
       "modo_mantenimiento": modo_mantenimiento
    }`
  );
  return data.modo_mantenimiento || false;
}

export async function middleware(req: NextRequest) {
  const url = req.url;
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // Obtener el estado de mantenimiento (cacheado) s
  const modo_mantenimiento = await getMaintenanceMode(fetchMaintenanceMode);
  // Redirigir si está en modo mantenimientoo

  if (!modo_mantenimiento) {
    if (
      !url.includes("/mantenimiento") &&
      !url.includes("/studio") &&
      !url.includes("/emprende") &&
      !url.includes("/nuestras-tiendas") &&
      !url.includes("/pdf") &&
      !url.includes("/tyc") &&
      !url.includes("/pyp") && 
      !url.includes("/libro-reclamaciones-virtual") && 
      !url.includes("/politica-de-cambios") &&
      // No bloquear rutas de API (por ejemplo, /api/vendor-code) en modo mantenimiento
      !url.includes("/api")
    ) {
      const redirectUrl = new URL("/mantenimiento", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  // Leer token de NextAuth para obtener rol actualizado desde Sanity
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const roleFromToken = (token as any)?.role as string | undefined;

  // Fallback: rol desde cookies si no hay token
  const roleCookie =
    cookies.get("user-role")?.value ||
    cookies.get("rol")?.value ||
    undefined;

  // Detectar autenticación por presencia de token de NextAuth
  const isAuthenticated = Boolean(token);

  // Proteger /tienda y /tienda-mayorista: requiere estar autenticado y rol callcenter
  // Importante: si está autenticado, no confiar en cookies para el rol. Partir del token.
  let effectiveRole = isAuthenticated ? roleFromToken : (roleFromToken || roleCookie);

  // Si está autenticado, obtener el rol más reciente desde Sanity usando el email del token
  if (isAuthenticated) {
    const email = (token as any)?.email as string | undefined;
    if (email) {
      try {
        const data = await client.fetch<{ role?: string }>(
          groq`*[_type == "user" && email == $email][0]{ role }`,
          { email }
        );
        if (data?.role) {
          effectiveRole = data.role;
        }
      } catch (e) {
        // Ignorar error y continuar con el role existente
      }
    }
  }

  // Home "/": ahora es público (Busca tu Taba), accesible para todos
  // Ya no se requiere autenticación ni rol específico para acceder a la página principal

  // Si está autenticado pero NO tiene rol válido, bloquear acceso a rutas no públicas
  const isPublicPath =
    pathname.startsWith("/pdf") ||
    pathname.startsWith("/tyc") ||
    pathname.startsWith("/pyp") ||
    pathname.startsWith("/nuestras-tiendas") ||
    pathname.startsWith("/emprende") ||
    pathname.startsWith("/libro-reclamaciones-virtual") ||
    pathname.startsWith("/politica-de-cambios") ||
    pathname.startsWith("/mantenimiento") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") || 
    // Tratar cualquier ruta de API como pública a efectos de middleware,
    // para no interferir con las respuestas JSON/redirects propios de las APIs
    pathname.startsWith("/api") ||
    pathname.startsWith("/verificar-vendedor") ||
      pathname.startsWith("/users");

  const hasValidRole = effectiveRole === "callcenter" || effectiveRole === "admin";
  if (isAuthenticated && !isPublicPath) {
    // No bloquear aquí '/generar-codigo-vendedor'; se validará más abajo con su propia whitelist
    if (pathname.startsWith("/generar-codigo-vendedor")) {
      // pasar al siguiente bloque
    } else if (!hasValidRole) {
      return NextResponse.redirect(new URL("/pdf", req.url));
    }
  }

  const needsProtection =
    pathname.startsWith("/tienda") ||
    pathname.startsWith("/tienda-mayorista") ||
    pathname.startsWith("/pagar") ||
    pathname.startsWith("/carrito") ||
    pathname.startsWith("/generar-codigo-vendedor");

  if (needsProtection) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    // El rol ya fue refrescado más arriba cuando isAuthenticated

    // Rutas protegidas: validar rol por ruta
    if (pathname.startsWith("/generar-codigo-vendedor")) {
      const allowed = ["admin", "callcenter", "mayorista", "emprendedor"];
      const hasAccess = allowed.includes(effectiveRole || "");
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/pdf", req.url));
      }
    } else {
      const hasAccess = effectiveRole === "callcenter" || effectiveRole === "admin";
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/pdf", req.url));
      }
    }
  }

  const res = NextResponse.next();
  // Headers de diagnóstico
  res.headers.set("x-authenticated", String(isAuthenticated));
  if (effectiveRole) {
    res.headers.set("x-user-role", effectiveRole);
    res.headers.set("x-role-source", roleFromToken ? "token" : (roleCookie ? "cookie" : "none"));
  } else {
    res.headers.set("x-user-role", "");
    res.headers.set("x-role-source", "none");
  }
  return res;
}
export const config = {
  matcher: ["/((?!_next|favicon.ico|mantenimiento|auth|api/auth).*)", "/users/:path*"],
};
