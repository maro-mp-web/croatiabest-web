/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.email = \"maro.webdeveloper@gmail.com\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3085844811",
        "max": 0,
        "min": 0,
        "name": "listingId",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text622344374",
        "max": 0,
        "min": 0,
        "name": "listingName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3764321573",
        "max": 0,
        "min": 0,
        "name": "ownerId",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4040589309",
        "max": 0,
        "min": 0,
        "name": "senderId",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "email2224870840",
        "name": "senderEmail",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "email"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3065852031",
        "max": 0,
        "min": 0,
        "name": "message",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      }
    ],
    "id": "pbc_1709638221",
    "indexes": [],
    "listRule": "@request.auth.id = ownerId || @request.auth.id = senderId || @request.auth.email = \"maro.webdeveloper@gmail.com\"",
    "name": "inquiries",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.email = \"maro.webdeveloper@gmail.com\"",
    "viewRule": "@request.auth.id = ownerId || @request.auth.id = senderId || @request.auth.email = \"maro.webdeveloper@gmail.com\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1709638221");

  return app.delete(collection);
})
