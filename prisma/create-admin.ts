import "dotenv/config"
import { PrismaClient } from "@/src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL! 
})

const prisma = new PrismaClient({ adapter })

async function createAdmin() {
    try {
        const name = process.env.ADMIN_NAME
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const password = process.env.ADMIN_PASSWORD

        if(!name || !email || !password) {
            console.error("Todos los campos son obligatorios")
            return
        }

        const userExist = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if(userExist) {
            console.log("El usuario que ingresaste ya existe")
            return
        }

        const hashPassword = await bcrypt.hash(password, 12)

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        })

        console.log("¡El usuario se creo correctamente!")
    
    } catch (error) {
        console.log("Hubo un problema al intentar crear el usuario: ", error)
        process.exitCode = 1
    }    
}

createAdmin()
    .catch((error) => {
        console.log("Hubo un problema al intentar ejecutar createAdmin: ", error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })