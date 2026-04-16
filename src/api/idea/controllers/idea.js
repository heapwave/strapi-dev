"use strict";

/**
 * idea controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { Core } = require("@strapi/strapi");
// module.exports = createCoreController('api::idea.idea');

module.exports = createCoreController(
  "api::idea.idea",
  /** @param {{strapi: Core.Strapi}} strapi */ ({ strapi }) => ({
    // @ts-ignore
    async find(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("请先登录");
      }

      // Sanitize the client-supplied query first
      // @ts-ignore
      await this.validateQuery(ctx);
      // @ts-ignore
      const sanitizedQuery = await this.sanitizeQuery(ctx);

      // Inject the user filter after sanitization
      const userFilter = { user: { id: { $eq: user.id } } };
      // @ts-ignore
      const existingFilters = sanitizedQuery.filters;

      // @ts-ignore
      const finalFilters = existingFilters
        ? { $and: [existingFilters, userFilter] }
        : userFilter;

      //   const userFilter = { user: { id: { $eq: user.id } } };
      //   const existingFilters = ctx.query?.filters;

      //   ctx.query = {
      //     ...ctx.query,
      //     filters: existingFilters
      //       ? { $and: [existingFilters, userFilter] }
      //       : userFilter,
      //   };

      /**
       * reference: https://docs.strapi.io/cms/api/rest/filters
       * reference: https://docs.strapi.io/cms/backend-customization/controllers#extending-core-controllers
       * reference: https://docs.strapi.io/cms/backend-customization/controllers#sanitization-and-validation-in-controllers
       * reference: https://docs.strapi.io/cms/api/rest/filters
       */

      // @ts-ignore
      //   await this.validateQuery(ctx);

      // Overall the code will work, but adding await this.validateQuery(ctx) before super.find(ctx) is recommended to ensure the client-supplied filters are properly validated.
      //   return await super.find(ctx);

      // @ts-ignore
      const { results, pagination } = await strapi
        .service("api::idea.idea")
        // @ts-ignore
        .find({ ...sanitizedQuery, filters: finalFilters });

      // @ts-ignore
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
      // @ts-ignore
      return this.transformResponse(sanitizedResults, { pagination });
    },

    // @ts-ignore
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized("请先登录");
      }

      const payload = ctx.request.body?.data || {};

      if (
        typeof payload.content !== "string" ||
        payload.content.trim() === ""
      ) {
        return ctx.badRequest("content is required and must be a string");
      }

      // 强制以后端 JWT 用户为准，防止前端伪造 user 字段
      // @deprecated in Strapi v5
      // const newIdea = await strapi.entityService.create("api::idea.idea", {
      //   data: {
      //     ...payload,
      //     user: user.id, // Connect the idea to the authenticated user
      //   },
      // });
      // use this:
      const newIdea = await strapi.documents("api::idea.idea").create({
        data: {
          ...payload,
          user: user.id,
        },
        status: "published", // 👈 auto-publish on creation
        /**
         * Note: This only works if the Draft & Publish feature is enabled on the idea content-type. If it's disabled, all entries are published by default anyway.
         */
      });

      /**
       * reference: https://docs.strapi.io/cms/api/document-service#create
       * reference: https://docs.strapi.io/cms/api/document-service/status#create
       */

      // @ts-ignore
      const sanitized = await this.sanitizeOutput(newIdea, ctx);
      // @ts-ignore
      return this.transformResponse(sanitized);
    },
  }),
);
