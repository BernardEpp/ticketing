# Ticketing Client

This is the ticketing client in the form of a front-end web application to handle ticket purchases.

The client is build with next js (server side rendered react).
Requests are handled with the axios library. Styles are implemented with the bootstrap framework.

## Cross namespace service communication

If the client service wants to make a request to another service during the server side rendering phase we need to alter the base url in order to forward the request via the ingress-nginx-controller. Note, that the ingress controller is not in the same kubectl namespace as the other services.

You can check the namespaces with:

```
  kubectl get namespaces
```

Then, look for the name of the ingress controller service:

```
  kubectl get services -n ingress-nginx
```

The final base url then has the form of

````
  http://SERVICE_NAME.NAMESPACE_NAME.svc.cluster.local
```

which should be

```
  http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
```
````

## Stipe Modal

We use the package react-stripe-checkout to create a stripe checkout modal.

While in the stripe test/dev mode you can use card details found on the stripe testing site as stripe.com/testing

A possible card is:

BRAND NUMBER CVC DATE
Visa 4242424242424242 Any 3 digits Any future date
