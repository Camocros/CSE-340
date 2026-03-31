/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
require("dotenv").config()

const app = express()

const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)

/* ***********************
 * Index Route
 *************************/
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"


app.use((err, req, res, next) => {
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "Sorry, an unexpected error occurred."
  })
})

/* ***********************
 * Start Server
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on http://${host}:${port}`)
})