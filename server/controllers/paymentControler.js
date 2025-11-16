import midtransClient from "midtrans-client";

export const createTransaction = async (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: `ORD-${Date.now()}`,
        gross_amount: req.body.price,
      },
      qris: true,
      customer_details: {
        email: req.body.email,
        phone: req.body.whatsapp,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ redirect_url: transaction.redirect_url });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error });
  }
};
