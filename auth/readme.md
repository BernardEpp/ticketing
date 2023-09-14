# The Auth Service

This is the microservice for the user auth.

## The Auth Mechanism

We will use a JWT stored in a cookie to handle authorization.
JWTs a great for authorization, especially if we have different microservices build with different technologies.
We will store the JWT as a Cookie in the response header. This is useful because we can set the auth status on the very first request of our application which is required if we use server side rendering.

Furthermore we will not encrypt the cookies content because decryption can be difficult to ensure on other microservices build with different technologies. This should also not be an issue because JWTs are tamper resistant. We will notice when an JWT has been altered.

The JWT is signed with a secret that is made available to the services as an environment variable in the individual containers.

The secret (jwt-secret) is created by running a imperative command in kubernetes:

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

IMPORTANT: Do not share this command. It is a security risk. However you need to now it every time you spin up a new kubernetes cluster. Also, in production you would use a more complex string than 'asdf'.

You can list your secrets with

```
kubectl get secrets
```

## Test

We use jest as a test framework. In addition, we use an in-memory mongo db library for the test execution.

Run:

```
  npm run test
```
