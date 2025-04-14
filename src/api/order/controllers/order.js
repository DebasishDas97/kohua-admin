
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  async create(ctx) {
    const { products } = ctx.request.body;


    if (!products || products.length === 0) {
      return ctx.throw(400, 'No products found');
    }

    // Calculate total price in paise
    const totalAmount = products.reduce((total, item) => total + (item.price * item.quantity), 0) * 100;

    const { currency = 'INR', receipt = 'order_receipt' } = ctx.request.body;

    try {
      const options = {
        amount: totalAmount, // Razorpay expects amount in paise
        currency,
        receipt,
      };

      const order = await razorpayInstance.orders.create(options);
      return { order };
    } catch (err) {
      console.error("Error creating Razorpay order", err);
      ctx.response.status = 500;
      return { error: 'Razorpay order creation failed', details: err };
    }
  },
};

