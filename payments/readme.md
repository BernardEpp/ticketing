# Payments Service

This is the payments service. It uses the Stripe API to process payments.

## Stripe Developer API

The stripe secret key is stored in the kubernetes cluster as a secret. You can do this by:

```
  kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=[secret]
```

The name of the secret is 'stripe-secret'.

Double check your secrets by:

```
  kubectl get secrets
```

## Stripe Dev Mode

While in stripe developer mode no real transactions are processed.
You can use the token 'tok-visa' to authenticate your test payment.
