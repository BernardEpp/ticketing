# NATS Test

This is a small side project to get familiar with NATS Streaming Server.

Note that we will run NATS Streaming server outside of kubernetes!

## Port Forward

To connect a publisher programm (outside of the cluster) to the NATS pod inside the kubernetes cluster you can simply open up a port on the kubernetes node. This is a simple solution for this test project.

In order to temporarily forward, run in a separate terminal:

```
  kubectl port-forward NATS_POD_NAME 4222:4222
```

## Run

For this demo project you need to run the kubernetes cluster as always:

```
  skaffold dev
```

Then forward the port as described in the section above and run the publisher and listener in separate terminals:

```
  kubectl port-forward NATS_POD_NAME 4222:4222
```

```
  npm run listen
```

```
  npm run publish
```

## Monitoring

NATS comes with a build in monitoring server.
Again, you need to forward it's port in order to access it:

```
  kubectl port-forward NATS_POD_NAME 8222:8222
```

Then you can access it on:

```
  localhost:8222/streaming
```

## Delete Pod

During development, it sometimes can be useful to restart the entire event bus system to get rid of past events.
You can easily do this by deleting the pod, the deployment will automatically start a new version. So run:

```
  kubectl delete pod POD_NAME
```
