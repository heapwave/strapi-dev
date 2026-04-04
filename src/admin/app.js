import brandLogo from './extensions/auth.png';

const config = {
  /**
   * Defines availables locales
   */
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    'zh-Hans',
    // 'zh',
  ],
  /**
   * Extends the translations
   */
  translations: {},
  /**
   * Accepts a `logo` key to replace the default Strapi logo on login screen
   */
  auth: {
    logo: brandLogo
  },
  /**
   * Accepts a `favicon` key to replace the default Strapi favicon
   */
  head: {},
  /**
   * Accepts the `logo` key to change the logo in the main navigation
   */
  menu: {},
  /**
   * Overwrite theme properties for light and dark modes
   */
  theme: {
    light:{},
    dark:{}
  },
  /**
   * Toggles displaying the video tutorials
   */
  tutorials: false,
  /**
   * Accepts the `releases` key (Boolean) to toggle displaying notifications about new releases
   */
  notifications: {
    release: true
  }
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
