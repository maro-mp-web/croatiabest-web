/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const blogs = app.findCollectionByNameOrId("blogs");
  if (blogs) {
    blogs.createRule = "@request.auth.email = 'maro.webdeveloper@gmail.com'";
    app.save(blogs);
  }

  const media = app.findCollectionByNameOrId("media");
  if (media) {
    media.createRule = "@request.auth.email = 'maro.webdeveloper@gmail.com'";
    app.save(media);
  }
}, (app) => {
  const blogs = app.findCollectionByNameOrId("blogs");
  if (blogs) {
    blogs.createRule = null;
    app.save(blogs);
  }

  const media = app.findCollectionByNameOrId("media");
  if (media) {
    media.createRule = null;
    app.save(media);
  }
})
