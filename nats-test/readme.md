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

## Manual Test

You can test this listener manually by sending a http request by yourself via Postman or ThunderClient.

Make sure the cluster is running, the NATS Port is forwarded and a listener is running (all in separate terminals):

(run in the ticketing directory)

```
  skaffold dev
```

(run in this directory)

```
  kubectl port-forward NATS_POD_NAME 4222:4222
```

```
 npm run listen
```

Make a POST request with a body such as (in JSON, i.e. content-type: application/json in the header):

```
{
  "title": "New Concert",
  "price": 500
}
```

You should see a log message in the terminal -that runs skaffold - that a ticket was created.

If this test is not working, make sure that the specified subjects are the same. Otherwise the events are processed in different channels.

## Delete Pod

During development, it sometimes can be useful to restart the entire event bus system to get rid of past events.
You can easily do this by deleting the pod, the deployment will automatically start a new version. So run:

```
  kubectl delete pod POD_NAME
```

## Database Transaction

In the current implementation, we save a record (i.e. ticket) to a database, publish an event to NATS and return the result of the http request to the user. It is technically possible that the record is saved but the event cannot be published. To avoid such scenarios one can use a database transaction which will ensure that only both or none of the two processes (saving to db and event publish) are possible. There is also a build in feature in mongo db that handles this.
However, for the scope of this application we will not use this.
