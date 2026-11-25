const { z } = require('zod');
const { allowedTypes } = require('./serviceSchemas');

const createUserSchema = z.object({
    nameUser: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    services: z.array(z.object({
        nameService: z.string().trim().min(1).max(100),
        type: z.enum(allowedTypes)
    })).default([])
});

const updateUserSchema = z.object({
    nameUser: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255)
})

module.exports = { createUserSchema };