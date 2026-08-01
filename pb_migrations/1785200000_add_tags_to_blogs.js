/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307"); // blogs

  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "json_tags_field",
    "maxSize": 2000000,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307");
  collection.fields.removeById("json_tags_field");
  return app.save(collection);
})
