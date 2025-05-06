import cron from "node-cron";
import { paymentExpiryJob } from "./jobs/expiry.payment.job";

export const expirySchedule = async () => {
  cron.schedule("* * * * *", async () => {
    console.log(`Running expiry job at ${new Date()}`);
    paymentExpiryJob();
    expiryPointJob();
    expiryDiscountCodeJob();
  });
};
