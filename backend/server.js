const express = require('express');
const app = express();
app.use(express.json());
const { ItemNotFoundException } = require('./exceptions/ItemNotFoundException');
const { BadRequestException } = require('./exceptions/BadRequestException');
const PORT = 3000;

const items = [
    { id: 1, name: 'Tv'},
    {id: 2, name: 'Monitor'}
] 

app.get('/api/items', (req, res)=> {
    try{
    const name = req.query.name;

    if(name){
        const item = items.filter(item => item.name === name);
        return res.status(200).json(item);
    }
    
    
    res.status(200).json(items);
    }catch(error){
        if(error.statusCode){
            return res.status(error.statusCode).json({error : error.message});
        }
        return res.status(500).json({error : "Iternal server error"});
    }
})

app.get('/api/items/:id', (req, res) => {
    try{
    const id = Number(req.params.id);
    const item = items.find(item => item.id === id);

    if(!item){
        throw new ItemNotFoundException();
    }

    res.status(200).json(item);
    }catch(error){
        if(error.statusCode){
            return res.status(error.statusCode).json({error : error.message});
        }
        return res.status(500).json({error : "Iternal server error"});
    }
})

app.post('/api/items', (req, res) => {
    try{   
    const {name} = req.body;

    if(!name){
        throw new BadRequestException("The name field is required");
    }

    const newItem = {
        id: items.length ? Math.max(...items.map(item => item.id))+1 : 1,
        name
    };
    items.push(newItem);

    res.status(201).json(newItem);
    }catch(error){
        console.log("ERRO REAL:", error);
        if(error.statusCode) {
            
            return res.status(error.statusCode).json({error : error.message });
        }
        return res.status(500).json({error : "Internal server error"});
    }
})

app.put('/api/items/:id', (req, res) => {
    try{
    const id = Number(req.params.id);
    const item = items.find(item => item.id === id);

    if(!item){
        throw new ItemNotFoundException();
    }

    const {name} = req.body;
    if(!name){
        throw new BadRequestException("The name field is required");
    }
    item.name = name;
    res.status(200).json(item);
    }catch(error){
        if(error.statusCode){
            return res.status(error.statusCode).json({error : error.message });
        }
        return res.status(500).json({error : "Internal server error"});
    }
})

app.delete('/api/items/:id', (req, res) => {
    try{
    const id = Number(req.params.id);
    const index = items.findIndex(item => item.id === id);
    if(index === -1){
        throw new ItemNotFoundException();
    }

    items.splice(index, 1);
    res.status(204).send();
    }catch(error){
        if(error.statusCode){
            return res.status(error.statusCode).json({error : error.message});
        }
        return res.status(500).json({error : "Internal server error"});
    }
})

app.listen(PORT, () => {
    console.log('API a executar em http://localhost:' + PORT);
});