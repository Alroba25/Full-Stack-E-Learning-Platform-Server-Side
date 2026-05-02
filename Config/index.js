const { default: mongoose } = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(
      "mongodb://Alroba25:Afmma1228@ac-lzaejfn-shard-00-00.r7eio6m.mongodb.net:27017,ac-lzaejfn-shard-00-01.r7eio6m.mongodb.net:27017,ac-lzaejfn-shard-00-02.r7eio6m.mongodb.net:27017/?ssl=true&replicaSet=atlas-l4uth0-shard-0&authSource=admin&appName=Cluster0",
    )
    .then(console.log("Connected to MongoDB"))
    .catch((e) => console.log("Error in connection", e.message));
};

module.exports = connectDB;
