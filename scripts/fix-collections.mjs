import PocketBase from 'pocketbase';
import fs from 'fs';

const pb = new PocketBase('http://127.0.0.1:8090');

const collectionSchemaCities = {
  name: 'cities',
  type: 'base',
  system: false,
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'region', type: 'text', required: true },
    { name: 'population', type: 'text' },
    { name: 'image', type: 'url' },
    { name: 'lat', type: 'number' },
    { name: 'lng', type: 'number' },
    { name: 'mayor', type: 'text' },
    { name: 'areaCode', type: 'text' },
    { name: 'zipCode', type: 'text' },
    { name: 'officialWeb', type: 'url' },
    { name: 'description', type: 'text' },
    { name: 'descriptionEn', type: 'text' }
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

const collectionSchemaIslands = {
  name: 'islands',
  type: 'base',
  system: false,
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'region', type: 'text', required: true },
    { name: 'population', type: 'text' },
    { name: 'image', type: 'url' },
    { name: 'lat', type: 'number' },
    { name: 'lng', type: 'number' },
    { name: 'area', type: 'text' },
    { name: 'highestPeak', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'descriptionEn', type: 'text' }
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

async function run() {
  await pb.admins.authWithPassword('admin@croatiabest.hr', 'admin123456');

  // Delete if exist
  try {
    const citiesCol = await pb.collections.getFirstListItem('name="cities"');
    if (citiesCol) {
      await pb.collections.delete(citiesCol.id);
      console.log('Deleted existing cities collection');
    }
  } catch (e) {
    console.log('No existing cities collection found or error deleting');
  }

  try {
    const islandsCol = await pb.collections.getFirstListItem('name="islands"');
    if (islandsCol) {
      await pb.collections.delete(islandsCol.id);
      console.log('Deleted existing islands collection');
    }
  } catch (e) {
    console.log('No existing islands collection found or error deleting');
  }

  // Create
  try { await pb.collections.create(collectionSchemaCities); console.log("Created cities collection."); } catch (e) { console.log("Error creating cities", e.message); }
  try { await pb.collections.create(collectionSchemaIslands); console.log("Created islands collection."); } catch (e) { console.log("Error creating islands", e.message); }
}

run();
