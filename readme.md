# Ticketing

This is a ticketing application using a microservice architecture.

This is part of a course by Stephen Grider on udemy.

The purpose of this project is to get familiar how microservice applications works and to build one. If working, this should be scalable and production ready code (except some minor todos).

This project uses technologies such as Kubernetes, Docker, Node, Next JS / React, axios + express, NATS Streaming Server and Jest for testing.

Not everything you find here will be ready for production, some parts might not even be recommended to be used in production at all (e.g. NATS Streaming Server is already deprecated). In addition, the services are build in a 'test-first' approach, i.e. tests are written for different scenarios before their implementation. However, this project is not build in a textbook TDD approach and the overall test-coverage is not on the level for a serious production ready app.
There are also a lot of in-code comments mainly for myself that reflect my learning yourney through the project. In general, comments like this should be avoided and best replaced with a good test suite and documentation. This is a principle of clean-code as comments tend to degrade over time.

## Run

To startup the kubernetes cluster, run:

```
   skaffold dev
```

### Run locally with Docker Desktop

1. Edit host file (etc/hosts on mac):

   127.0.0.1 ticketing.dev

2. Change kubernetes context

With docker desktop, just make sure you have the right context selected in the ide.

```
TODO: put cli command for context setup here
```

3.

### Run on Google Cloud Kubernetes Engine (GKE):

1. Adjust the skaffold file:

```
 googleCloudBuild:
    projectId: ticketing-dev-396510
  artifacts:
    - image: us.gcr.io/ticketing-dev-396510/auth
```

And make sure all related files reference the correct docker image and that the images exist.

2. Edit host file
   Change the host according to the load balancers IP address.

   34.77.218.113 ticketing.dev

## Setup a new service

To setup a new node module, create a new directory, cd into it and run:

```
   npm init -y
```

To setup TypeScript run:

```
   ts --init
```

## Comments

Some more comments

## Backlog

- ~~ strikthrouhgs can be used for done tasks ~~
- move commons project elsewhere
- Create and push git repo on github
- Clarify usage of named and default exports and make it more consistent
- Write proper source code doc
- Run Linter?
- More tests?
- Provision cluster with tf?
- Replace NATS with Kafka or other alternative?
