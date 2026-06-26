require("dotenv").config();
const express = require("express");
const connectDB = require("./Config");
const routes = require("./Routes/index.route");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);
app.use("/", routes);
connectDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
