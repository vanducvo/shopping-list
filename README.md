# shopping-list
## Following unit 6 of turorial: [Create your first Node.js application](https://developer.ibm.com/technologies/node-js/tutorials/learn-nodejs-your-first-node-application)

## How to run?
1. Install dependencies: ```npm install```
2. Load create database: ```npm run load-db```
3. Run server: ```npm run server```

## API support:


1. Get items with ```GET``` method:
    * By id: ```/items?id=item_id```
    * By upc: ```/items?id=item_upc```
    * By desciption: ```/items?id=item_decription```
        * *(response list of items, if not found is ```[]```)*
2. Create list with ```POST``` method and url ```/lists```:
    * Data send format: ```'{"description": string}'```
3. Get list with get method with ```GET``` method and url ```/lists/id_list```
4. Update list with ```PUT``` method and url ```/lists```
    * Data send format: ```'{"description": string}'```
