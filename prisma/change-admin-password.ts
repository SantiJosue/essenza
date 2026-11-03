import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter })

async function changeAdminPassword() {
    try {
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const newPassword = process.env.ADMIN_PASSWORD
        
        if(!email || !newPassword) {
            throw new Error("Faltan el correo o la nueva contraseña")
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(!user) {
            throw new Error("No existe un administrador con ese correo")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword
            }
        })

        console.log("¡La contraseña se actualizó correctamente!")

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error)
        process.exitCode = 1
    }
}

changeAdminPassword()
    .finally(async () => {
        await prisma.$disconnect()
    })