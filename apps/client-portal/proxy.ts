import { auth } from "./app/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/";

  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/soporte/:path*"], // Protegemos solo la ruta de soporte si se desea, o todo el app
};
