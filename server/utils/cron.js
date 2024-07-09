// Cron job to hit endpoint every 14 mins to keep backend alive always
import * as cron from "cron";
import https from "https";

const backendUrl = process.env.BACKEND_URL;

const job = new cron.CronJob("*/14 * * * *", function () {
  console.log("Restarting server");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server restarted");
      } else {
        console.error(
          `failed to restart server with status: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Error during restart:", err.message);
    });
});

export default job;
