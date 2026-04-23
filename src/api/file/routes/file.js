module.exports = {
  routes: [
    {
      method: "GET",
      path: "/file/:filename",
      handler: "api::file.file.preview",
    },
    {
      method: "POST",
      path: "/file/upload",
      handler: "api::file.file.upload",
    },
  ],
};
