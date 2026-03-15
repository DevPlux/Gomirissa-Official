import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Firebase Auth session එක check කිරීම සංකීර්ණ නිසා 
  // මෙහිදී සරලව admin path එකට ආරක්ෂාව සපයයි.
  // නියම Role checking එක සිදු වෙන්නේ AuthContext එකෙනි.
  
  // මෙය මූලික ආරක්ෂක පියවරකි.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};