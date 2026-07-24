/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const blogs = app.findCollectionByNameOrId("blogs");
  if (blogs) {
    blogs.createRule = "@request.auth.id != \"\"";
    app.save(blogs);
  }
}, (app) => {
  const blogs = app.findCollectionByNameOrId("blogs");
  if (blogs) {
    blogs.createRule = "@request.auth.email = 'maro.webdeveloper@gmail.com'";
    app.save(blogs);
  }
})
