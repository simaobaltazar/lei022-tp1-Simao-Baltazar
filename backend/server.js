const express = require('express');
const app = express();
app.use(express.json());
const { ItemNotFoundException } = require('./src/exceptions/ItemNotFoundException');
const { BadRequestException } = require('./src/exceptions/BadRequestException');
const { ConflictException } = require('./src/exceptions/ConflictException');

const PORT = 3000;

const services = [
    { id: 1, nameService: 'Apple Music', type:'student', joining:'2012-08-05T17:00:00.000Z'},
    {id: 2, nameService: 'Prime Videos', type:'family', joining:'2023-09-04T13:00:00.000Z'}
] 

app.get('/api/serviceManager', (req, res)=> {
    try{
    const name = req.query.name;

    if(name){
        const service = services.filter(service => service.nameService.toLocaleLowerCase() === name.toLocaleLowerCase());
        return res.status(200).json(service);
    }
    
    
    res.status(200).json(services);
    }catch(error){
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

app.get('/api/serviceManager/:id', (req, res) => {
    try{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const service = services.find(service => service.id === id);

    if(!service){
        throw new ItemNotFoundException();
    }



    res.status(200).json(service);
    }catch(error){
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

app.post('/api/serviceManager', (req, res) => {
    try{   
    const {nameService, type} = req.body || {};
    const allowedTypes = ['student', 'individual', 'family'];
    
    if(!nameService || !type){
        throw new BadRequestException("The name and type field is required");
    }

    const existingService = services.find(service => service.nameService.toLowerCase() === nameService.toLowerCase());

    if(existingService){
        throw new ConflictException("A service with this name already exists");
    }

    if(!allowedTypes.includes(type)){
        throw new BadRequestException("Invalid type . Allowed values are: student, individual, family");
    }



    const newService = {
        id: services.length ? Math.max(...services.map(service => service.id))+1 : 1,
        nameService,
        type,
        joining: new Date().toISOString()
    };

    res.set('Location', `/api/serviceManager/${newService.id}`);

    services.push(newService);

    res.status(201).json(newService);
    }catch(error){
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

app.put('/api/serviceManager/:id', (req, res) => {
    try{
    const {nameService, type} = req.body;
    const allowedTypes = ['student', 'individual', 'family'];
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }

    const service = services.find(service => service.id === id);

    if(!service){
        throw new ItemNotFoundException();
    }


    if(!nameService || !type){
        throw new BadRequestException("The name and type field is required");
    }

    const existingService = services.find(service => service.nameService.toLowerCase() === nameService.toLowerCase());


    if(existingService && existingService.id !== id){
        throw new ConflictException("A service with this name already exists");
    }

    if(!allowedTypes.includes(type)){
        throw new BadRequestException("Invalid type . Allowed values are: student, individual, family");
    }

    service.nameService = nameService;
    service.type = type;
    res.status(200).json(service);
    }catch(error){
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

app.delete('/api/serviceManager/:id', (req, res) => {
    try{
    const id = Number(req.params.id);
    
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException("Invalid ID. It must be a positive integer.");
    }
    
    const index = services.findIndex(service => service.id === id);
    if(index === -1){
        throw new ItemNotFoundException();
    }

    services.splice(index, 1);
    res.status(204).send();
    }catch(error){
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