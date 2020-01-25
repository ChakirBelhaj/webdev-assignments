//Initiallising npm packages
var express = require("express");
var bodyParser = require("body-parser");
var swaggerJSDoc = require("swagger-jsdoc");
var app = express();

//initialising sql
const sqlite = require("sqlite3").verbose();
let database = my_database('./phones.db');

//configuration for our swagger plug-in
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Customer API",
            description: "This is the required documentation for our node API assignment-3",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["http://localhost:8080"]
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//CORS Middleware
app.use(function(req, response, next) {
    //Enabling CORS policy for cross sight requests
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
 *       400:
 *         description: Bad request
 */
app.get("/api/phones", function(req, response) {
    database.all("SELECT * FROM phones", function(err, rows) {
        response.json(rows);
    });
});

/**
 * @swagger
 * /api/reset:
 *   get:
 *     tags:
 *       - phones
 *     description: Reset database to origin state
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Database resetted to origin state
 *       400:
 *         description: Bad request
 */
app.get("/api/reset", function(req, response) {
    var query = "DELETE FROM [phones] where NOT id=1 " ;
    database.run(
        query,
        function(err) {
            if (err) {
                response.body(err.message)
                response.sendStatus(400);
            } else {
                response.sendStatus(200);
            }
        }
    );
});

/**
 * @swagger
 * /api/phones/{id}:
 *   get:
 *     tags:
 *       - phones
 *     description: Get phone by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: false
 *         type: number
 *         format: int
 *         example: 5
 *     responses:
 *       200:
 *         description: Succesfully retrieved phone
 *       404:
 *         description: Phone with given id does not exists
 */
app.get("/api/phones/:id", function(req, response) {
    database.get("SELECT * FROM phones where id = '" + req.params.id + "' ", function(err, rows) {
        if(rows == undefined) response.sendStatus(404)
        response.json(rows);
    });
});

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
 *       - name: create phone
 *         in: body
 *         description: Phone post data.
 *         required: false
 *         type: number
 *         format: int
 *         example: {image : https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg, brand : Fairfone, model : FP3, os : Android, screensize : 5 }
 *     responses:
 *       200:
 *         description: Phone successfully created
 *       404:
 *         description: Phone with given id does not exists
 */
app.post("/api/phones", function(req, response) {
    data = req.body;
    database.run(
        `INSERT INTO phones(image, brand, model, os, screensize ) VALUES(?,?,?,?,?)`,
        [data.image, data.brand, data.model, data.os, data.screensize],
        function(err) {
            if (err) {
                response.body(err.message)
                response.sendStatus(400);
            } else {
                response.sendStatus(200);
            }
        }
    );
});

/**
 * @swagger
 * /api/phones/{id}:
 *   put:
 *     tags:
 *       - phones
 *     description: Updates a single phone
 *     produces: application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: false
 *         type: number
 *         format: int
 *         example: 5
 *       - name: updates phone
 *         in: body
 *         description: Phone put data.
 *         required: false
 *         type: number
 *         format: int
 *         example: {image : https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg, brand : Fairfone, model : FP3, os : Android, screensize : 5 }
 *     responses:
 *       200:
 *         description: Successfully updated
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user ID.
 *             username:
 *               type: string
 *               description: The user name.
 *             -name: test
 *             example: {image : https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg, brand : Fairfone, model : FP3, os : Android, screensize : 5 }
 *       404:
 *         description: Phone with given id does not exists
 */
app.put("/api/phones/:id", function(req, response) {
    var query = "UPDATE [phones] SET image=?, brand=?, model=?, os=?, screensize=? WHERE Id=?"
    values = [req.body.image, req.body.brand, req.body.model, req.body.os, req.body.screensize, req.params.id]
    database.run(
      query,
      values,
      function(err) {
          if (err) {
            response.body(err.message)
            response.sendStatus(400);
          } else {
              response.sendStatus(200);
          }
      }
  );
});

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
 *         description: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Phone with given id does not exists
 */
app.delete("/api/phones/:id", function(req, response) {
    var query = "DELETE FROM [phones] WHERE Id=" + req.params.id;

    database.run(
        query,
        function(err) {
            if (err) {
                response.body(err.message)
                response.sendStatus(400);
            } else {
                response.sendStatus(200);
            }
        }
    );
});


function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	    CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairfone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}