require("dotenv").config();

const express = require("express");
const connectDB = require("./Config");
const routes = require("./Routes/index.route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const allowedOrigins = ["http://localhost:3001", "https://darsfiy.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

app.use("/", routes);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
