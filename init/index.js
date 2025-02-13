const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Nestly";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Convert old 'image' field to 'images' array if necessary,
  // and add an owner to each listing.
  initData.data = initData.data.map((obj) => {
    if (obj.image && !obj.images) {
      obj.images = [obj.image]; // wrap the old image object in an array
      delete obj.image; // remove the old key
    }
    return { ...obj, owner: "675c493c064ecbe5b1fbe60d" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

