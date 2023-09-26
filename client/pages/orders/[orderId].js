import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const msLeft = new Date(order.expiresAt) - new Date();

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    // todo: consider to store the key as a env variable or kubernetes secret
    <div>
      You have {timeLeft} seconds left to pay or the order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51NtuL7JRH3uhA2EwvXxJSWU7GeIE1mfBtBoDaXeOZPmmt3nptZamvi1AWndAPuQo0Qxo3CjH5rpcJpjekpwQEn6F00ydWo1HP8"
        amount={order.ticket.price * 100}
        currency="EUR"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
