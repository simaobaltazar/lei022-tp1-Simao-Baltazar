const { translatePrismaError } = require('../exceptions/translatePrismaError');

function errorHandler(err, req, res, next){
    if(res.headersSent) return next(err);

    err = translatePrismaError(err);
    res.set('Content-Type', 'application/problem+json');

    if(err.statusCode){
        return res.status(err.statusCode).json({
            status: err.statusCode,
            title: err.name || 'Request error',
            detail: err.message
        })
    }

    console.error(err);
    return res.status(500).json({
        status: 500,
        title: 'Internal server error',
        detail: 'Unexpected error occurred'
    });
}

module.exports = {errorHandler};