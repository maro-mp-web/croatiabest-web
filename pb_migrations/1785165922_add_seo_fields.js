/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collectionIds = ["pbc_3998141477", "pbc_3391861992"]; // cities, islands

  for (const cid of collectionIds) {
    const collection = app.findCollectionByNameOrId(cid);

    const textFields = [
      "seoTitle", "seoDescription", "seoKeywords",
      "seoTitleEn", "seoDescriptionEn", "seoKeywordsEn"
    ];

    for (const name of textFields) {
      collection.fields.add(new Field({
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_" + name,
        "max": 0,
        "min": 0,
        "name": name,
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }));
    }

    collection.fields.add(new Field({
      "hidden": false,
      "id": "json_wikiSections",
      "maxSize": 0,
      "name": "wikiSections",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "json"
    }));

    app.save(collection);
  }
}, (app) => {
  const collectionIds = ["pbc_3998141477", "pbc_3391861992"];
  for (const cid of collectionIds) {
    const collection = app.findCollectionByNameOrId(cid);

    const textFields = [
      "seoTitle", "seoDescription", "seoKeywords",
      "seoTitleEn", "seoDescriptionEn", "seoKeywordsEn"
    ];

    for (const name of textFields) {
      collection.fields.removeById("text_" + name);
    }
    collection.fields.removeById("json_wikiSections");

    app.save(collection);
  }
})
