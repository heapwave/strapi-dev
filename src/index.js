'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    strapi.log.info('=== AUTO-SUBSCRIPTION BOOTSTRAP RUNNING ===');

    // Hook into the users-permissions user service 'add' method
    const userService = strapi.plugin('users-permissions').service('user');

    if (!userService) {
      strapi.log.error('Users-permissions user service not found');
      return;
    }

    strapi.log.info(`User service type: ${typeof userService.add}`);

    const originalAdd = userService.add;

    userService.add = async (params) => {
      strapi.log.info('=== USER ADD INTERCEPTED ===');

      const user = await originalAdd.call(userService, params);
      strapi.log.info(`User created with ID: ${user?.id}`);

      if (user?.id) {
        try {
          const freePlan = await strapi.db
            .query('api::subscription-plan.subscription-plan')
            .findOne({
              where: { tier: 'free', enabled: true },
            });

          strapi.log.info(`Free plan lookup result: ${JSON.stringify(freePlan)}`);

          if (freePlan) {
            const subscription = await strapi.db
              .query('api::subscription.subscription')
              .create({
                data: {
                  user: user.id,
                  plan: freePlan.id,
                  status: 'active',
                  startDate: new Date().toISOString(),
                },
              });
            strapi.log.info(`Free subscription created for user ${user.id}: ${JSON.stringify(subscription)}`);
          } else {
            strapi.log.warn('No free subscription plan found - cannot auto-assign');
          }
        } catch (error) {
          strapi.log.error('Error creating auto-subscription:', error);
        }
      }

      return user;
    };

    strapi.log.info('=== AUTO-SUBSCRIPTION HOOK REGISTERED ===');
  },
};
