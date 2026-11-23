const {BadRequestException} = require('../exceptions/BadRequestException');

function validate(schema, property = 'body'){
    return (req, res, next) => {
        const result = schema.safeParse(req[property] ?? {});

        if(!result.success){
            const detail = result.error.issues
                .map(issue => `${issue.path.join('.')}: ${issue.message}`)
                .join('; ');
            return next(new BadRequestException(detail));
        }

        req[property] = result.data;
        next();
    };

}
module.exports = {validate};