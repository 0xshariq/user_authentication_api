import cron from "node-cron"
import mongoose from "mongoose"
import User from "../models/user.js"
import { connectToDatabase } from "../db/database.js"

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 0 * * 0"

async function resetWeeklyRequestCounts() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  try {
    const result = await User.updateMany(
      { "apiKey.lastWeeklyReset": { $lt: oneWeekAgo } },
      {
        $set: {
          "apiKey.requestCount": 0,
          "apiKey.lastWeeklyReset": new Date(),
        },
      },
    )
    console.log(`Weekly request counts reset. ${result.modifiedCount} documents updated.`)
  } catch (error) {
    console.error("Error resetting weekly request counts:", error)
  }
}

// Connect to the database when the script starts
await connectToDatabase()

// Weekly reset
cron.schedule(CRON_SCHEDULE, async () => {
  console.log("Running weekly reset...")
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase()
  }
  await resetWeeklyRequestCounts()
})

console.log(`Cron job scheduled for request count resets: ${CRON_SCHEDULE}`)

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down")
    process.exit(1)
  }, 10000)

  await mongoose.connection.close()
  console.log("Database connection closed")
  process.exit(0)
})

export { resetWeeklyRequestCounts }

