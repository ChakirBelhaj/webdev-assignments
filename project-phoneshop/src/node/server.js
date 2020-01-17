//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var swaggerJSDoc = require("swagger-jsdoc");
var app = express();
const sqlite3 = require("sqlite3").verbose();

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
app.get("/swagger.json", function(req, response) {
    response.setHeader("Content-Type", "application/json");
    response.send(swaggerSpec);
});

let database = new sqlite3.Database(":memory:", err => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Connected to the phones SQlite database.");
});

database.serialize(function() {
    database.run("CREATE TABLE phones (image TEXT, brand TEXT, model TEXT, os TEXT, screensize INTEGER)");
    image1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/440px-IPhone_X_vector.svg.png"
    image2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S8_and_S8_Plus.png/569px-Samsung_Galaxy_S8_and_S8_Plus.png"

    // seed data into the database
    database.run(`INSERT INTO phones(image, brand, model, os, screensize ) VALUES(?,?,?,?,?)`, [image1 , "Iphone", "iPhone X", "Ios", 5]);
    database.run(`INSERT INTO phones(image, brand, model, os, screensize ) VALUES(?,?,?,?,?)`, [image2, "Samsung" ,"Galaxy s8", "Android", 9]);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// // //CORS Middleware
app.use(function(req, response, next) {
    //Enabling CORS
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "*");
    response.header("Access-Control-Allow-Headers", "*");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

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
app.get("/api/phones", function(req, response) {
    database.all("SELECT * FROM phones", function(err, rows) {
        response.json(rows);
    });
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
app.get("/api/singlePhone", function(req, response) {
    console.log("dddd");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("random numbers that should come in the form of json");
    response.end();
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
app.post("/api/phones", function(req, response) {
    data = req.body;
    database.run(
        `INSERT INTO phones(image, brand, model, os, screensize ) VALUES(?,?,?,?,?)`,
        [data.image, data.brand, data.model, data.os, data.screensize],
        function(err) {
            if (err) {
                return console.log(err.message);
            } else {
                response.sendStatus(200);
            }
        }
    );
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
app.put("/api/phones/:id", function(req, response) {
    var query = "UPDATE [phones] SET" + 
    "  image=" + req.body.image + 
    ", brand=" + req.body.brand + 
    ", model=" + req.body.model + 
    ", os=" + req.body.os + 
    ", screensize=" + req.body.screensize + 
    "  WHERE Id=" + req.params.id;

    database.run(
      query,
      function(err) {
          if (err) {
              return console.log(err.message);
          } else {
              response.sendStatus(200);
          }
      }
  );
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
app.delete("/api/phones /:id", function(req, response) {
    var query = "DELETE FROM [phones] WHERE Id=" + req.params.id;
    executeQuery(response, query);
});
