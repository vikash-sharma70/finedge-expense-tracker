require("dotenv").config()
const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 3000

const startServer = async () => {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`FinEdge Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
    console.log(`Health: http://localhost:${PORT}/health`)
  })

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err)
    server.close(() => process.exit(1))
  })
}

startServer()