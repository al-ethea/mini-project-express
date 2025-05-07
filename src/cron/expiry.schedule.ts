import cron from "node-cron";
import { paymentExpiryJob } from "./jobs/expiry.payment.job";
import { pointsExpiryJob } from "./jobs/expiry.points.job";
import { discountCodeExpiryJob } from "./jobs/expiry.discount.code.job";

export const expirySchedule = async () => {
  cron.schedule("* * * * *", async () => {
    console.log(`Running expiry job at ${new Date()}`);
    paymentExpiryJob();
    pointsExpiryJob();
    discountCodeExpiryJob();
  });
};
