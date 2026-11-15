const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const db = await prisma.$transaction(async tx => {
        const users = await Promise.all([
            tx.user.upsert({ where: {email: "salvador@example.com"}, update: {}, create:{nameUser: "Salvador Maria", email: "salvador@example.com"} }),
            tx.user.upsert({ where: { email: "maria@exemplo.pt" }, update: {}, create: { nameUser: "Maria Santos", email: "maria@exemplo.pt" } })
        ]);

        const services = await Promise.all([
            tx.service.upsert({ where: { userId_nameService: {userId: users[0].id, nameService: "Apple Music"}}, update: {}, create: {nameService: "Apple Music", type: "student", joining: new Date("2012-08-05T17:00:00.000Z"), userId: users[0].id}}),
            tx.service.upsert({ where: { userId_nameService: { userId: users[0].id, nameService: "Prime Videos" } }, update: {}, create: { nameService: "Prime Videos", type: "family", joining: new Date("2023-09-04T13:00:00.000Z"), userId: users[0].id } }),
            tx.service.upsert({ where: { userId_nameService: { userId: users[1].id, nameService: "Netflix" } }, update: {}, create: { nameService: "Netflix", type: "individual", joining: new Date("2024-02-10T20:00:00.000Z"), userId: users[1].id } })
        ]);
        return { users, services};
    });
    console.log(`Seed completed: ${db.users.length} users, ${db.services.length} services.`);
    
}
main().catch(e => { console.error(e); process.exit(1);}).finally(() => prisma.$disconnect());