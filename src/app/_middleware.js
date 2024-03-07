import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Assuming you have a way to check auth tokens stored in cookies or elsewhere
  const token = localStorage.getItem('token')
  console.log("ECHO")
  if (!token && pathname !== '/users/login') {
    return NextResponse.redirect(new URL('/users/login', request.url));
  }

  return NextResponse.next();
}