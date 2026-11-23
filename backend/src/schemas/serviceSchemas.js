const { z } = require('zod');

const allowedTypes = ['student','individual','family'];

const createServiceSchema = z.object({
    nameService: z.string().trim().min(1).max(100),
    type: z.enum(allowedTypes),
    userId: z.number().int().positive()
});

const updateServiceSchema = z.object({
    nameService: z.string().trim().min(1).max(100),
    type: z.enum(allowedTypes)
});

const idParamSchema = z.object({
    id: z.coerce.number().int().positive()
});

module.exports = {allowedTypes, createServiceSchema, updateServiceSchema, idParamSchema}