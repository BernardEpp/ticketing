import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // on the server
    console.log('we are on the server');
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', // note, that the ingress-nginx controller is not in the same namespace
      headers: req.headers, // include headers in order to forward the auth cookie inside it
    });
  } else {
    // on the browser/client
    console.log('we are on the client');
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
