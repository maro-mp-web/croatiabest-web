/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blogs");
  
  if (collection) {
    const contentField = collection.fields.find((f) => f.name === "content");
    if (contentField) {
      contentField.max = 0; // 0 = unlimited
    }
    
    const contentEnField = collection.fields.find((f) => f.name === "contentEn");
    if (contentEnField) {
      contentEnField.max = 0; // 0 = unlimited
    }

    app.save(collection);
  }
}, (app) => {
  // no revert needed
})
