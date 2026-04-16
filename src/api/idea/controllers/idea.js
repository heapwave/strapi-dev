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
      // @ts-ignore
      const sanitized = await this.sanitizeOutput(newIdea, ctx);
      // @ts-ignore
      return this.transformResponse(sanitized);
    },
  }),
);
