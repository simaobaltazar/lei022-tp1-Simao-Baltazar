const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173'}));
const { ItemNotFoundException } = require('./src/exceptions/ItemNotFoundException');
const { ConflictException } = require('./src/exceptions/ConflictException');
const { sendWebhook } = require('./src/grpc/webhookClient');
const { PrismaClient} = require('@prisma/client');
const { errorHandler} = require('./src/middleware/errorHandler')
const { validate } = require('./src/middleware/validate');
const { createServiceSchema, idParamSchema, updateServiceSchema } = require('./src/schemas/serviceSchemas');
const { createUserSchema, updateUserSchema} = require('./src/schemas/userSchemas')

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

app.get('/api/serviceManager/:id', validate(idParamSchema, 'params'),async (req, res) => {
    const id = Number(req.params.id);

    const service = await prisma.service.findUnique({where: {id} });

    if(!service){
        throw new ItemNotFoundException();
    }
    res.status(200).json(service);
})

app.get('/api/users/:id', validate(idParamSchema, 'params'),async (req, res) => {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
        where: {id},
        include: {services: {orderBy: {id: 'asc'}}}
     });

    if(!user){
        throw new ItemNotFoundException();
    }

    res.status(200).json(user);
})

app.post('/api/serviceManager', validate(createServiceSchema), async (req, res) => { 
    const {nameService, type, userId} = req.body;

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

    const newService = await prisma.service.create({
        data: {nameService, type, userId}
    });

    res.set('Location', `/api/serviceManager/${newService.id}`);

    sendWebhook('service.created', newService);

    res.status(201).json(newService);
})

app.post('/api/users', validate(createUserSchema) ,async (req,res) =>{
    const {nameUser, email, services} = req.body;

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

app.put('/api/serviceManager/:id', validate(idParamSchema, 'params'), validate(updateServiceSchema), async (req, res) => {
    const {nameService, type} = req.body;
    const id = Number(req.params.id);

    const service = await prisma.service.findUnique({where: {id}});

    if(!service){
        throw new ItemNotFoundException();
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

    const updatedService = await prisma.service.update({
        where: {id},
        data: {nameService, type}
    });

    sendWebhook('service.updated', updatedService);


    res.status(200).json(updatedService);
})

app.put('/api/users/:id', validate(idParamSchema, 'params'), validate(updateUserSchema), async (req,res) => {
    const id = req.params.id;
    const {nameUser, email} = req.body;

    const user = await prisma.user.findUnique( {where: {id} });

    if(!user){
        throw new ItemNotFoundException();
    }

    const emailInUse = await prisma.user.findFirst({ where: {email, NOT: {id}}});
    
    if(emailInUse){
        throw new ConflictException('A user with this email already exists');
    }

    const updatedUser = await prisma.user.update({where: {id},
                                                data: {nameUser, email}
    });
    res.status(200).json(updatedUser);
});

app.delete('/api/serviceManager/:id', validate(idParamSchema, 'params') ,async (req, res) => {
    const id = Number(req.params.id);
    
    const service = await prisma.service.findUnique({where: {id}});

    if(!service){
        throw new ItemNotFoundException();
    }

    const removedService = await prisma.service.delete({where:{id}});

    sendWebhook('service.deleted', removedService);

    res.status(204).send();
})

app.delete('/api/users/:id', validate(idParamSchema, 'params') ,async (req,res) => {
        const id = Number(req.params.id);

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