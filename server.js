/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const session = require("express-session")
const pool = require("./database/")
require("dotenv").config()

const app = express()

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

// Express Messages Middleware
app.use(require("connect-flash")())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.use(express.urlencoded({ extended: true }))

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
app.get("/", utilities.handleErrors(async function (req, res) {
  let nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}))

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 5500

/* ***********************
 * Catch 404 and forward to error handler
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = ""
  try {
    nav = await utilities.getNav()
  } catch (error) {
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message || "Sorry, an unexpected error occurred.",
    nav,
  })
})

/* ***********************
 * Start Server
 *************************/
app.listen(port, "0.0.0.0", () => {
  console.log(`app listening on port ${port}`)
})