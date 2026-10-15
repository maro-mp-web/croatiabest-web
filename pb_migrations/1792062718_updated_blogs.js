/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307")

  // add field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "bool855260329",
    "name": "showOnHomepage",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "date1629928600",
    "max": "",
    "min": "",
    "name": "publishDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1063089307")

  // remove field
  collection.fields.removeById("bool855260329")

  // remove field
  collection.fields.removeById("date1629928600")

  return app.save(collection)
})
