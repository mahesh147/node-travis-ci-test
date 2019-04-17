const path = require("path");

const express = require("express");
const hbs = require("hbs");
const app = express();

const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

//Define path for express config

const publicDirectoryPath = path.join(__dirname, "../public/");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);
//Setup static directory to serve

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
    res.render("index", {
        header: "Weather",
        name: "Mahesh Chandran"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        header: "About me",
        name: "Mahesh Chandran"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        header: "Help Page",
        helpText: "This page has the help information for the web app",
        name: "Mahesh Chandran"
    });
});
app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        });
    }

    geocode(
        req.query.address,
        (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error });
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error });
                }

                res.send({
                    forecast:
                        forecastData.summary +
                        "    The temperature outside is " +
                        forecastData.temperature +
                        " degrees. There is " +
                        forecastData.rainProb +
                        "% chance of rain",
                    location,
                    address: req.query.address
                });
            });
        }
    );

    // app.get("/products", (req, res) => {
    //     if (!req.query.search) {
    //         return res.send({
    //             error: "You must provide a search term"
    //         });
    //     }
    //     res.send({
    //         products: []
    //     });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        header: "404",
        errorMessage: "Help article not found.",
        name: "Mahesh Chandran"
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        header: "404",
        name: "Mahesh Chandran",
        errorMessage: "This page does not exist"
    });
});

app.listen(3000, () => {
    console.log("Server is up on port 3000");
});
