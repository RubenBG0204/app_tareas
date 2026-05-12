import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  // Clean up
  await prisma.task.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.category.deleteMany({})

  // Categories
  const catWork = await prisma.category.create({
    data: { name: 'Trabajo', color: '#3b82f6' },
  })
  const catPersonal = await prisma.category.create({
    data: { name: 'Personal', color: '#10b981' },
  })
  const catUrgent = await prisma.category.create({
    data: { name: 'Urgente', color: '#ef4444' },
  })

  // Users
  const user1 = await prisma.user.create({
    data: { name: 'Juan Perez', email: 'juan@example.com' },
  })
  const user2 = await prisma.user.create({
    data: { name: 'Maria Garcia', email: 'maria@example.com' },
  })

  // Tasks
  await prisma.task.create({
    data: {
      title: 'Finalizar reporte mensual',
      description: 'Terminar el reporte de ventas del mes de Mayo.',
      status: 'pendiente',
      categoryId: catWork.id,
      users: { connect: [{ id: user1.id }] },
      dueDate: new Date('2026-05-20'),
    },
  })

  await prisma.task.create({
    data: {
      title: 'Comprar comida',
      description: 'Ir al supermercado por provisiones.',
      status: 'completada',
      categoryId: catPersonal.id,
      users: { connect: [{ id: user1.id }, { id: user2.id }] },
    },
  })

  await prisma.task.create({
    data: {
      title: 'Revisión técnica',
      description: 'Llevar el coche al taller.',
      status: 'pendiente',
      categoryId: catUrgent.id,
      users: { connect: [{ id: user2.id }] },
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
