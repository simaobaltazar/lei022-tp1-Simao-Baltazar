const express = require('express');
const app = express();
app.use(express.json());
const { ItemNotFoundException } = require('./src/exceptions/ItemNotFoundException');
const { BadRequestException } = require('./src/exceptions/BadRequestException');
const { ConflictException } = require('./src/exceptions/ConflictException');
const { sendWebhook } = require('./src/grpc/webhookClient');
const { PrismaClient} = require('@prisma/client');
const { translatePrismaError} = require('./src/exceptions/translatePrismaError');

const PORT = 3000;

const prisma = new PrismaClient();

app.get('/api/serviceManager', async (req, res)=> {
    try{
    const nameFilter = req.query.name;

   const service = await prisma.service.findMany({
        where: nameFilter ? {nameService:{ equals: nameFilter, mode: 'insensitive'} } : {},
        orderBy: {id: 'asc'}
   });
    
    res.status(200).json(service);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.get('/api/users', async (req, res)=> {
    try{
    const users = await prisma.user.findMany({
        orderBy: {id: 'asc'}
   });
    
    res.status(200).json(users);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.get('/api/serviceManager/:id', async (req, res) => {
    try{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const service = await prisma.service.findUnique({where: {id} });

    if(!service){
        throw new ItemNotFoundException();
    }



    res.status(200).json(service);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.get('/api/users/:id', async (req, res) => {
    try{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const user = await prisma.user.findUnique({
        where: {id},
        include: {services: {orderBy: {id: 'asc'}}}
     });

    if(!user){
        throw new ItemNotFoundException();
    }

    res.status(200).json(user);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.post('/api/serviceManager', async (req, res) => {
    try{   
    const {nameService, type, userId} = req.body || {};
    const allowedTypes = ['student', 'individual', 'family'];
    
    if(!nameService || !type || userId === undefined){
        throw new BadRequestException("The name, type and userId field is required");
    }

    if(!Number.isInteger(userId) || userId <= 0){
        throw new BadRequestException("Invalid userId. It must be a positeve integer");
    }

    const user = await prisma.user.findUnique({where: {id: userId}});

    if(!user){
        throw new ItemNotFoundException();
    }

    const existingService = await prisma.service.findFirst({
        where:{userId, nameService:{ equals: nameService, mode: 'insensitive'}}
    });

    if(existingService){
        throw new ConflictException("A service with this name already exists");
    }

    if(!allowedTypes.includes(type)){
        throw new BadRequestException("Invalid type . Allowed values are: student, individual, family");
    }



    const newService = await prisma.service.create({
        data: {nameService, type, userId}
    });

    res.set('Location', `/api/serviceManager/${newService.id}`);

    sendWebhook('service.created', newService);


    res.status(201).json(newService);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.put('/api/serviceManager/:id', async (req, res) => {
    try{
    const {nameService, type} = req.body || {};
    const allowedTypes = ['student', 'individual', 'family'];
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const service = await prisma.service.findUnique({where: {id}});

    if(!service){
        throw new ItemNotFoundException();
    }


    if(!nameService || !type){
        throw new BadRequestException("The name and type field is required");
    }

    const existingService = await prisma.service.findFirst({
        where: {
            userId: service.userId,
            nameService: { equals: nameService, mode: "insensitive"},
            NOT: {id}
        }
    });


    if(existingService){
        throw new ConflictException("A service with this name already exists");
    }

    if(!allowedTypes.includes(type)){
        throw new BadRequestException("Invalid type . Allowed values are: student, individual, family");
    }

    const updatedService = await prisma.service.update({
        where: {id},
        data: {nameService, type}
    });

    sendWebhook('service.updated', updatedService);


    res.status(200).json(updatedService);
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.delete('/api/serviceManager/:id', async (req, res) => {
    try{
    const id = Number(req.params.id);
    
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }
    
    const service = await prisma.service.findUnique({where: {id}});

    if(!service){
        throw new ItemNotFoundException();
    }

    const removedService = await prisma.service.delete({where:{id}});

    sendWebhook('service.deleted', removedService);

    res.status(204).send();
    }catch(error){
        error = translatePrismaError(error);
        res.set('Content-Type', 'application/problem+json');
        if(error.statusCode){
            return res.status(error.statusCode).json({
                status: error.statusCode,
                title: error.name || 'Request error',
                detail : error.message
            });
        }
        return res.status(500).json({
            status: 500,
            title : "Internal server error",
            detail: "Unexpected error occurred"
        });
    }
})

app.listen(PORT, () => {
    console.log('API a executar em http://localhost:' + PORT);
});