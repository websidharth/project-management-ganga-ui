import config from '@/config';
import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserDto } from '@/dtos/UserDto';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: '',
        },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const loginUrl: string = `${config.apiBaseUrl}/auth/login`;

        try {
          const response = await axios.post(
            loginUrl,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            {
              headers: {
                'content-type': 'application/json',
                clientId: config.clientId,
              },
              withCredentials: false,
            }
          );

          return response.data.data.user;

        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Invalid username or password');
          }
          return null;
        }
      },
    }),
  ],
  secret: `${process.env.NEXTAUTH_SECRET}`,
  // callbacks: {
  //   async jwt({ token, user }) { 
  //     if (user) {
  //       (token as any).user = user; 
  //       if ((user as any).token) {
  //         (token as any).token = (user as any).token;
  //       }
  //     }
  //     return token;
  //   },

  //   async session({ session, token }) { 
  //     (session as any).user = (token as any).user ?? session.user; 
  //     (session as any).token = (token as any).token ?? null;
  //     return session;
  //   },

  // },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token as unknown as UserDto;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  events: {
    async signOut() { },
  },
  // Enable debug messages in the console if you are having problems
  debug: config.enviroment !== 'production',
  pages: {
    signIn: '/',
  },
};
