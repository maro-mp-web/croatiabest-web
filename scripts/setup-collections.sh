#!/bin/bash
# Script za kreiranje PocketBase kolekcija

PB_URL="http://127.0.0.1:8090"
ADMIN_EMAIL="maro.webdeveloper@gmail.com"
ADMIN_PASS=""

echo "Unesi admin lozinku:"
read -s ADMIN_PASS

# 1. Login kao admin
echo "Logiranje kao admin..."
TOKEN=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "GREŠKA: Neuspješan login. Provjeri lozinku."
  exit 1
fi
echo "Token dobiven: ${TOKEN:0:20}..."

AUTH="Authorization: Bearer $TOKEN"

# 2. Kreiraj 'uploads' kolekciju za fileove
echo "Kreiram 'uploads' kolekciju..."
curl -s -X POST "$PB_URL/api/collections" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "uploads",
    "type": "base",
    "system": false,
    "schema": [
      {
        "name": "file",
        "type": "file",
        "required": true,
        "maxSize": 2097152,
        "maxSelect": 1,
        "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"]
      },
      {
        "name": "owner",
        "type": "relation",
        "required": false,
        "maxSelect": 1,
        "collectionId": "_pb_users_auth_"
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "sortRule": "-created"
  }' | jq .

# 3. Kreiraj 'listings' kolekciju
echo "Kreiram 'listings' kolekciju..."
curl -s -X POST "$PB_URL/api/collections" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "listings",
    "type": "base",
    "system": false,
    "schema": [
      {"name":"name","type":"text","required":true,"max":200},
      {"name":"locationCategoryId","type":"text","required":true},
      {"name":"locationCategoryType","type":"text"},
      {"name":"paymentStatus","type":"text"},
      {"name":"address","type":"text"},
      {"name":"city","type":"text","required":true},
      {"name":"region","type":"text"},
      {"name":"latitude","type":"number"},
      {"name":"longitude","type":"number"},
      {"name":"description","type":"text"},
      {"name":"contactPhone","type":"text"},
      {"name":"contactEmail","type":"email"},
      {"name":"webAddress","type":"url"},
      {"name":"photoUrls","type":"json"},
      {"name":"products","type":"json"},
      {"name":"status","type":"text"},
      {"name":"ownerId","type":"text","required":true}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "sortRule": "-created"
  }' | jq .

echo ""
echo "Gotovo! Kolekcije su kreirane."
