import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { prisma } from "@/src/lib/prisma"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  
  providers: [
    CredentialsProvider({
      name: "Credenciales",

      credentials: {
        email: {
          label: "Correo electrónico",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const passwordIsValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!passwordIsValid) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,

  pages: {
    signIn: "/login",
  },
}