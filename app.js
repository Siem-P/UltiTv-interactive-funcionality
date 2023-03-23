// Importeer express uit de node_modules map
import express from "express";
import bodyParser from "body-parser";

const apiUrl = "https://api.ultitv.fdnd.nl/api/v1"
const postUrl = "https://api.ultitv.fdnd.nl/api/v1/players"

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	const playerUrl = apiUrl + "/players"
	const data = await fetchApi(playerUrl)
  console.log(data);
  res.render("index", data);
});

app.get("/newPlayer",  (req, res) => {
	res.render("newPlayer")
});

app.post("/newPlayer", (req, res) => {
	console.log(req.body)
	postJson(postUrl, req.body).then((data) => {
    let newMember = { ... req.body }

    if (data.success) {
      res.redirect("/?memberPosted=true") 
      // TODO: squad meegeven, message meegeven
      // TODO: Toast meegeven aan de homepagina
    } else {
      const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
      const newdata = { error: errormessage, values: newMember }
      
      res.render('newPlayer', newdata)
    }
  })
});

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

// Function for fetching the API
async function fetchApi(url) {
  const data = await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
  return data;
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}