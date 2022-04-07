# element-template v1

Base template for the creation of doFlo elements. 

## Element Template Walkthrough

Congratulations, if your reading this you've likely decided to extend the doFlo platform by building a custom doFlo element. This documentation will walk you through the configuration, file structure and code so that you have the information needed to do build and deploy your first element.

### What is a doFlo element ?

In its most basic form an element is a succinct proxy to a service and its related capabilities. In most cases this represents a 3rd party service and actions that can be preformed via an API or WebService and / or WebEvents (webhooks) that can be consumed and ultimately responded to.

Multiple components make up an element 

#### What is an Action

An action is something that is done. This usually corresponds with something that can be done with an API. For example if you are building an element to represent an API that can update orders or update users, your action would document and provide methods to call the endpoints of that API.

#### What is a Signal

A signal is something that is responded to. This usually corresponds to an event originating from your service. For example if you are building an element to represent a service that notifies its users of changes; possibly via webhooks, webevents or message bus services your signal would document and provide a means of listening for such events and is the bridge for such events to the doFlo service. Most actions that take place on the doFlo service are in response to some type of "Signal"

#### What is a Credential

A credential is the definition and structure by which you expect doFlo users interacting with your element to establish trust with the services you are proxying via your element. If you have an API that requires credentials, doFlo needs to know how to provide those to you on behalf of our users. Additionally our users need a friendly, trusted and secure way process to provide us those credentials so that we can provide them to your services. Credential definitions tell us what to save, how to present it and how to collect it.

#### What is a Data Type

A data type is a structure of information that is either derived from a common structure or is wholely unique to your service. It is a contract that describes parts of your data. In the case of derived data type, these help us share concepts between services and work as super and sub types. For example if you have an eCommerce product and you have an order record you may have specific info on your order record that is not on a general order record. doFlo has a general order record and all of the services that know how to consume that type of record can automatically work together. So if you derive a type or expose a type with a base of one of the widely used Super types its likely that many other elements in the doFlo ecosystem already know what to do with your data. This promotes your element as automatically pluggable with existing elements in our UI's and makes things easier for our users. You can also create wholely unique structures and create UI elements to display those structures in our tables, forms and dashboards. 

## Repo Layout

* *readme.md* - this file 
* *.gitignore* - what you hide from git
* *doflo.jsonc* - element config file ( json but with support for comments, hence the "c" at the end )
* *remote*
  * *src* - source code for server side actions (*nodejs in typescript*)
* *client*
  * *connect* - our first supported app (an oAuth Helper)
    * *src* - source code for UI elements of the "connect" app (*reactjs in typescript*)
      * index.tsx 
