const express = require('express');
const app = express();
app.use(express.json());
const { ItemNotFoundException } = require('./src/exceptions/ItemNotFoundException');
const { BadRequestException } = require('./src/exceptions/BadRequestException');
const { ConflictException } = require('./src/exceptions/ConflictException');
const { sendWebhook } = require('./src/grpc/webhookClient');
const { PrismaClient} = require('@prisma/client');
const { errorHandler} = require('./src/middleware/errorHandler')

const PORT = 3000;

const prisma = new PrismaClient();

app.get('/api/serviceManager', async (req, res)=> {

    const nameFilter = req.query.name;

   const services = await prisma.service.findMany({
        where: nameFilter ? {nameService:{ equals: nameFilter, mode: 'insensitive'} } : {},
        orderBy: {id: 'asc'}
   });
    
    res.status(200).json(services);
})

app.get('/api/users', async (req, res)=> {
    const users = await prisma.user.findMany({
        orderBy: {id: 'asc'}
   });
    
    res.status(200).json(users);
})

app.get('/api/serviceManager/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const service = await prisma.service.findUnique({where: {id} });

    if(!service){
        throw new ItemNotFoundException();
    }
    res.status(200).json(service);
})

app.get('/api/users/:id', async (req, res) => {
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
})

app.post('/api/serviceManager', async (req, res) => { 
    const {nameService, type, userId} = req.body || {};
    const allowedTypes = ['student', 'individual', 'family'];
    
    if(!nameService || !type || userId === undefined){
        throw new BadRequestException("The name, type and userId field is required");
    }

    if(!Number.isInteger(userId) || userId <= 0){
        throw new BadRequestException("Invalid userId. It must be a positive integer");
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
})

app.post('/api/users', async (req,res) =>{
    const {nameUser, email, services = []} = req.body || {};
    const allowedTypes = ['student', 'individual', 'family'];

    if(!nameUser || !email){
        throw new BadRequestException("The name and email fields are required");
    }

    if(!Array.isArray(services)){
        throw new BadRequestException("services must be a list")
    }

    for(const service of services){
        if(!service.nameService || !service.type){
            throw new BadRequestException("Each service needs a name and a type");
        }
        if(!allowedTypes.includes(service.type)){
            throw new BadRequestException("Invalid type. Allowed values are: student, individual and family");
        }
    }

    const existingUser = await prisma.user.findUnique({where: { email }});

    if(existingUser){
        throw new ConflictException("A user with this email already exists");
    }

    const user = await prisma.$transaction(async (tx) => {

        const newUser = await tx.user.create({
            data: {nameUser, email}
        });

        for(const service of services){
            await tx.service.create({
                data: {nameService: service.nameService, type: service.type, userId: newUser.id}
            })
        }
        return tx.user.findUnique({
            where:{id: newUser.id},
            include: { services: true}
        });
    } );

    for(const service of user.services){
        sendWebhook('service.created', service);
    }

    res.set('Location', `/api/users/${user.id}`)
    res.status(201).json(user);
});

app.put('/api/serviceManager/:id', async (req, res) => {
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
})

app.delete('/api/serviceManager/:id', async (req, res) => {
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
})

app.delete('/api/users/:id', async (req,res) => {
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            throw new BadRequestException("Invalid ID. It must be a positive integer.");
        }

        const user = await prisma.user.findUnique({where: {id}});

        if(!user){
            throw new ItemNotFoundException();
        }

        const serviceCount = await prisma.service.count({where: {userId: id}});

        if(serviceCount > 0){
            throw new ConflictException("The user still has services and cannot be deleted")
        }

        await prisma.user.delete({where: {id}});

        res.status(204).send();
});

app.use((req,res) => {
    res.set('Content-Type', 'application/problem+json');
    res.status(404).json({ status: 404, title: 'Not found', detail: `Route ${req.method} ${req.path} not found`});
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log('API a executar em http://localhost:' + PORT);
});