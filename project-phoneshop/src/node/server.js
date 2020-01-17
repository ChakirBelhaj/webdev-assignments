//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var swaggerJSDoc = require("swagger-jsdoc");
var app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Customer API",
      description: "Customer API Information",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:5000"]
    }
  },
  apis: ["server.js"]
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerUi = require("swagger-ui-express");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// serve swagger
app.get("/swagger.json", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// Body Parser Middleware
// app.use(bodyParser.json());

// //CORS Middleware
// app.use(function(req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
//     next();
// });

//Setting up server
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    phones: "<dbphonesName>",
    password: "<dbPassword>",
    server: "<dbHost_URL>",
    database: " <dbName>"
};

//Function to connect to database and execute query
// var  executeQuery = function(res, query){
//      sql.connect(dbConfig, function (err) {
//          if (err) {
//                      console.log("Error while connecting database :- " + err);
//                      res.send(err);
//                   }
//                   else {
//                          // create Request object
//                          var request = new sql.Request();
//                          // query to the database
//                          request.query(query, function (err, res) {
//                            if (err) {
//                                       console.log("Error while querying database :- " + err);
//                                       res.send(err);
//                                      }
//                                      else {
//                                        res.send(res);
//                                             }
//                                });
//                        }
//       });
// }

// Routes
/**
 * @swagger
 * /api/phones:
 *   get:
 *     tags:
 *       - phones
 *     description: Returns all phonesss
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of phones
 */
app.get("/api/phones", function(req, res) {
    console.log("dddd");
    // var query = "select * from [phones]";
    // executeQuery (res, query);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("random numbers that should come in the form of json");
    res.end();
});

/**
 * @swagger
 * /api/phones/{id}:
 *   get:
 *     tags:
 *       - phones
 *     description: Returns a single phone
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: phone id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single phone
 *         schema:
 *           $ref: '#/definitions/phone'
 */
app.get("/api/singlePhone", function(req, res) {
  console.log("dddd");
  // var query = "select * from [phones]";
  // executeQuery (res, query);
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("random numbers that should come in the form of json");
  res.end();
});

//POST API
/**
 * @swagger
 * /api/phones:
 *   post:
 *     tags:
 *       - phones
 *     description: Creates a new phone
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: phone
 *         description: phone object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/phone'
 *     responses:
 *       200:
 *         description: Successfully created
 */
app.post("/api/phones", function(req, res) {
    var query = "INSERT INTO [phones] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password";
    executeQuery(res, query);
});

//PUT API
/**
 * @swagger
 * /api/phones/{id}:
 *   put:
 *     tags:
 *       - phones
 *     description: Updates a single phone
 *     produces: application/json
 *     parameters:
 *       name: phone
 *       in: body
 *       description: Fields for the phone resource
 *       schema:
 *         type: array
 *         $ref: '#/definitions/phone'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
app.put("/api/phones/:id", function(req, res) {
    var query = "UPDATE [phones] SET Name= " + req.body.Name + " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
    executeQuery(res, query);
});

// DELETE API
/**
 * @swagger
 * /api/phones/{id}:
 *   delete:
 *     tags:
 *       - phones
 *     description: Deletes a single phone
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: phone id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete("/api/phones /:id", function(req, res) {
    var query = "DELETE FROM [phones] WHERE Id=" + req.params.id;
    executeQuery(res, query);
});
