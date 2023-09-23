# The expirtation service

This is the service that handles the expiration dates for orders. It will notice the order service if an order expires. Note, that the expiration service is not responsible to cancel the orders. That is left to the order service.

I will use bull js to handle the timeouts on a redis server.
