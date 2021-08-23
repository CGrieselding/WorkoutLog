require('dotenv').config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");

app.use(Express.json());

const controllers = require("./controllers");

app.use('/user', controllers.userController);
app.use('/log', controllers.logController);

dbConnection.authenticate()
  .then(() => dbConnection.sync())
  .then(() => {
    app.listen(3005, () => {
      console.log(`[Server]: App is listening on 3005.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });