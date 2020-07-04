const http = require("http"),
  app = require("../src/app"),
  db = require("./db"),
  api = require("../config/api");

db.then(
  db => {
    console.log("\x1b[36m%s\x1b[0m", "MongoDB successfully connected");
    http.createServer(app).listen(process.env.PORT || api.port, () => {
      console.log("Server listening at http://localhost:" + api.port);
    });
  },
  err =>
    console.log("\x1b[33m%s\x1b[0m", "Error while connecting to mongodb: ", err)
);
