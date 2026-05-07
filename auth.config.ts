import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = [
        "/dashboard",
        "/tasks",
        "/coach",
        "/vault",
        "/progress",
        "/settings",
        "/onboarding",
        "/quickwin",
        "/proposals",
        "/rate-calculator",
        "/crm",
        "/admin",
      ];

      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
