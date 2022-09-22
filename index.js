const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const fs = require('fs');

// process management
const arguments = process.argv.splice(2),
      flag = arguments[0],
      data = arguments[1];
if(!flag || !data) {
  console.log('Provided data is not valid .');
  process.exit(1);
}
switch(flag){
  case '-i' : {
      importToDB(data);
      console.log('Processing imports ...');
      break;
  }
  case '-e' : {
      exportFromDB(data);
      console.log('Processing exports ...');
      break;
  }
  default : {
      console.log('Provided data is not valid .');
      process.exit(1);
  }
}

// export from db
async function exportFromDB(fileName){
  mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_Host}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`,
    async(err, data)=>{
      let collectionsList = await data.db.listCollections().toArray();
      let pendingCollectionGathering = [];
      let finalData = [];
      for(let counter = 0 ; counter < collectionsList.length ; counter++){
        pendingCollectionGathering.push(
          await data.db.collection(collectionsList[counter].name).find().toArray()
        )
      }
      Promise.all(pendingCollectionGathering).then((results)=>{
        for (let counter in results){
          finalData.push({
            name : collectionsList[counter].name,
            data : results[counter],
          })
        }
        fs.writeFile(fileName, JSON.stringify(finalData, null, 2), (err, result)=>{
          console.log('done');
          process.exit(0);
        })
      })
    }
  );
}

// import to db
async function importToDB(fileName){
  let targetConnection = await mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_Host}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`);
  let data = fs.readFile(fileName,async (err, data)=>{
    data = JSON.parse(data.toString());
    let pendingCollectionGathering = [];
    for(let counter = 0; counter < data.length; counter++){
      if(data[counter].name != 'system.version' && data[counter].name != 'system.users' && data[counter].data.length > 0){
        let collection = await targetConnection.connection.db.createCollection(data[counter].name);
        await collection.insertMany(data[counter].data);
      }
    }
    console.log('done');
    process.exit(0);
  });
}
