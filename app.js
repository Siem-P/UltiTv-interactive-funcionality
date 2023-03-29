// Importeer express uit de node_modules map
import express from "express";
import bodyParser from "body-parser";
import fs from "fs"

// API URL's 
let rawGameData = fs.readFileSync("./private/api/game/943.json");
let rawStatsData = fs.readFileSync("./private/api/game/943/statistics.json");
let parsedGameData = JSON.parse(rawGameData);
let parsedStats = JSON.parse(rawStatsData);

const apiUrl = "https://api.ultitv.fdnd.nl/api/v1"
const postUrl = "https://api.ultitv.fdnd.nl/api/v1/players"
const playerUrl = apiUrl + "/players"
const questionUrl = apiUrl + "/questions"
const questiondata = await fetchApi(questionUrl)
const playerdata = await fetchApi(playerUrl)

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	console.log(playerdata)
	console.log(questiondata)
  parsedGameData.team1CountryISO2Code = parsedGameData.team1CountryISO2Code.toLowerCase()
  parsedGameData.team2CountryISO2Code = parsedGameData.team2CountryISO2Code.toLowerCase() 
  res.render("index", {questions: questiondata.questions, players: playerdata.players, parsedGameData, parsedStats});
});

app.get("/newPlayer",  (req, res) => {
	res.render("newPlayer", {questions: questiondata.questions})
});

app.post("/newPlayer", async (req, res) => {
	req.body.answers = 
	[	
		{
			content: req.body.content,
			questionId: req.body.question 
		}
	]
	console.log(1, req.body)

	postJson(postUrl, req.body).then((data) => {
		
    let newPlayer = req.body

    if (data.succes) {
      res.redirect("/?memberPosterd=true") 
    } else {
			
      const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
      const newplayer = { error: errormessage, values: newPlayer }
			res.render("newPlayer", {questions: questiondata.questions, players: playerdata.players, newplayer})
    }
  })
});

app.set("port", process.env.PORT || 8005);

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
	console.log(2, JSON.stringify(body))
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}