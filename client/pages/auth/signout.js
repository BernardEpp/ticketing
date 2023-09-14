import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    console.log('signing user out...');
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
};

export default signout;
