import * as Yup from 'yup';
import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total;
};

class CreatePaymentIntentController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    // validando o  schema

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { products } = req.body;

    const amount = calculateOrderAmount(products);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}` // código copiado do Rodolfo. Na minha documentação não tem esse dpmcheckerLink
    });
  }
}

export default new CreatePaymentIntentController();
