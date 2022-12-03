const express = require("express"),
  cors = require("cors"),
  axios = require("axios"),
  bodyParser = require("body-parser");

const mapController = require('./controllers/map');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/getCoordinateData', mapController.getCoordinates)
app.post('/api/addCoordinates', mapController.addCoordinates)

// app.delete("/api/deleteLaunch/:id", vc.deleteLaunch);
// app.put("/api/updateLaunch/:id", vc.updateLaunch);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listeninggg on ${port}`));