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
const utilities = require("./utilities/")

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
app.get("/", utilities.handleErrors(function (req, res) {
  res.render("index", { title: "Home" })
}))

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"


/* ***********************
 * Catch 404 and forward to error handler
 *************************/
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = "" // Providing a fallback nav if available
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
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