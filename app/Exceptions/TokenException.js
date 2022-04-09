'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions');

class TokenException extends LogicalException {
    /**
     * Handle this exception by itself
     */
    handle(error, { response }) {
        if (error.name === 'InvalidJwtToken') {
            return response.status(500).send('Some message');
        }
    }
}