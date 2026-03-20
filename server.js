const app = require("./src/app");
const connectDB = require("./src/db/db");
require("dotenv").config();

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log("Server is running on PORT:", port);
});
