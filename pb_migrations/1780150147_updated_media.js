/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file123456",
    "maxSelect": 0,
    "maxSize": 0,
    "mimeTypes": null,
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // remove field
  collection.fields.removeById("file123456")

  return app.save(collection)
})
