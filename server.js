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
const path = require("path")

const app = express()

const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/inv", inventoryRoute)

/* ***********************
 * Index Route
 *************************/
app.get("/", utilities.handleErrors(async (req, res) => {
  res.render("index", { title: "Home" })
}))

/* ***********************
 * Catch 404
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Error Handler
 *************************/
app.use((err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "Sorry, an unexpected error occurred."
  })
})

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 5500

app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})