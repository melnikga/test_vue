'use strict';

/**
 * dot service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dot.dot');
