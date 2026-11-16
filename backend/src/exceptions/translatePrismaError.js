const { Prisma } = require('@prisma/client');
const { ConflictException } = require('./ConflictException');
const { ItemNotFoundException} = require('./ItemNotFoundException');

function translatePrismaError(error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
        if(error.code === 'P2002') return new ConflictException('A record with this value already exists');
        if(error.code == 'P2003') return new ConflictException('The operation violates a relationship between records');
        if (error.code === 'P2025') return new ItemNotFoundException();
    }
    return error;
}

module.exports = {translatePrismaError};