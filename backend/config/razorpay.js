import Razorpay from 'razorpay';
import config from './index.js';

const razorpay =
  config.razorpay.keyId && config.razorpay.keySecret
    ? new Razorpay({
        key_id: config.razorpay.keyId,
        key_secret: config.razorpay.keySecret
      })
    : null;

export default razorpay;
