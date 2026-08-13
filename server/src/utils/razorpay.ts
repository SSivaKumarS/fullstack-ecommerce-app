import Razorpay from "razorpay";

function checkEnv(name: string): string {
  const envValue = process.env[name];

  if (!envValue) {
    throw new Error(`Missing env: ${name}`);
  }

  return envValue;
}

const razorpayKeyId = checkEnv("RAZORPAY_KEY_ID");
const razorpayKeySecret = checkEnv("RAZORPAY_KEY_SECRET");

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export { razorpay, razorpayKeyId, razorpayKeySecret };

