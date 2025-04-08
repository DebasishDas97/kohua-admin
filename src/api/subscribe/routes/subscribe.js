'use strict';

/**
 * subscribe router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::subscribe.subscribe');
