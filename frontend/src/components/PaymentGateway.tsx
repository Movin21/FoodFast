import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm"; // You’ll create this next

const stripePromise = loadStripe(
  "pk_test_51RF9dH4JSs0z3pO68f1PQbWWFOyUWVsF2PX2ZdshTqKqM0q9FihxJ8oIfhr81XaCsthwRwnQ7fCJCnNdpUfaTO3s00rMfo9k8X"
);

function PaymentGateway() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default PaymentGateway;
