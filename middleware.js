import { NextResponse } from 'next/server';
 
export function middleware(request) {
  const allowedOrigins = 'http://localhost:3000'
  const origin = request.nextUrl.origin
  // if (allowedOrigins === origin) {
  //   console.log("igual")
  // }
  if (allowedOrigins !== origin) {
    //console.log("diferente")
    return NextResponse.rewrite(new URL('/', request.url));
  }

}
export const config = {
  matcher: '/api/:path*',
};

