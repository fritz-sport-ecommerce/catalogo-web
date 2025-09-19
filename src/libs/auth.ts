import { NextAuthOptions } from 'next-auth';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import sanityClient from './sanity';

export const authOptions: NextAuthOptions = {
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    SanityCredentials(sanityClient),
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: SanityAdapter(sanityClient),
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Incluir el rol en el JWT en cada request
    async jwt({ token }) {
      if (!token?.email) return token;
      const userData = await sanityClient.fetch<{ _id: string; role?: string }>(
        `*[_type == "user" && email == $email][0] {
          _id,
          role
        }`,
        { email: token.email }
      );

      if (userData?._id) token.id = userData._id;
      if (userData?.role) token.role = userData.role;
      return token as typeof token & { id?: string; role?: string };
    },

    // Propagar id y role a la sesión del cliente
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).id,
          role: (token as any).role,
        },
      };
    },
  },
};
