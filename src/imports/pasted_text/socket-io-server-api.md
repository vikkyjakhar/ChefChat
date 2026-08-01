Constructor
new Server(httpServer[, options])
httpServer <http.Server> | <https.Server>
options <Object>
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);

The complete list of available options can be found here.

new Server(port[, options])
port <number>
options <Object>
import { Server } from "socket.io";

const io = new Server(3000, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

The complete list of available options can be found here.

new Server(options)
options <Object>
import { Server } from "socket.io";

const io = new Server({
  // options
});

io.on("connection", (socket) => {
  // ...
});

io.listen(3000);

The complete list of available options can be found here.

Events
Event: 'connect'
Synonym of Event: "connection".

Event: 'connection'
socket (Socket) socket connection with client
Fired upon a connection from client.

io.on("connection", (socket) => {
  // ...
});

Event: 'new_namespace'
namespace Namespace
Fired when a new namespace is created:

io.on("new_namespace", (namespace) => {
  // ...
});

This can be useful for example:

to attach a shared middleware to each namespace
io.on("new_namespace", (namespace) => {
  namespace.use(myMiddleware);
});

to track the dynamically created namespaces
io.of(/\/nsp-\w+/);

io.on("new_namespace", (namespace) => {
  console.log(namespace.name);
});

Attributes
server.engine
A reference to the underlying Engine.IO server. See here.

server.sockets
<Namespace>
An alias for the main namespace (/).

io.sockets.emit("hi", "everyone");
// is equivalent to
io.of("/").emit("hi", "everyone");

Methods
server.adapter([value])
value <Adapter>
Returns <Server> | <Adapter>
Sets the adapter value. Defaults to an instance of the Adapter that ships with socket.io which is memory based. See socket.io-adapter. If no arguments are supplied this method returns the current value.

import { Server } from "socket.io"; 
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const io = new Server();

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// redis@3
io.listen(3000);

// redis@4
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.listen(3000);
});

server.attach(httpServer[, options])
httpServer <http.Server> | <https.Server>
options <Object>
Attaches the Server to an httpServer with the supplied options.

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server();

io.attach(httpServer);

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);

server.attach(port[, options])
port <number>
options <Object>
Attaches the Server on the given port with the supplied options.

import { Server } from "socket.io";

const io = new Server();

io.attach(3000);

io.on("connection", (socket) => {
  // ...
});

server.attachApp(app[, options])
app <uws.App>
options <Object>
Attaches the Socket.IO server to an µWebSockets.js app:

import { App } from "uWebSockets.js";
import { Server } from "socket.io";

const app = App();
const io = new Server();

io.attachApp(app);

io.on("connection", (socket) => {
  // ...
});

app.listen(3000, (token) => {
  if (!token) {
    console.warn("port already in use");
  }
});

server.bind(engine)
engine <engine.Server>
Returns <Server>
Advanced use only. Binds the server to a specific engine.io Server (or compatible API) instance.

import { createServer } from "node:http";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  res.writeHead(404).end();
});

const engine = new Engine();

engine.attach(httpServer, {
  path: "/socket.io/"
});

const io = new Server();

io.bind(engine);

httpServer.listen(3000);

server.close([callback])
callback <Function>
Closes the Socket.IO server and disconnect all clients. The callback argument is optional and will be called when all connections are closed.

info
This also closes the underlying HTTP server.

import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3030;
const io = new Server(PORT);

io.close();

const httpServer = createServer();

httpServer.listen(PORT); // PORT is free to use

io.attach(httpServer);

note
Only closing the underlying HTTP server is not sufficient, as it will only prevent the server from accepting new connections but clients connected with WebSocket will not be disconnected right away.

Reference: https://nodejs.org/api/http.html#serverclosecallback

server.disconnectSockets([close])
Added in v4.0.0

Alias for io.of("/").disconnectSockets(close).

// make all Socket instances disconnect
io.disconnectSockets();

// make all Socket instances in the "room1" room disconnect (and close the low-level connection)
io.in("room1").disconnectSockets(true);

tip
This method also works within a cluster of multiple Socket.IO servers, with a compatible adapter like the Postgres adapter.

In that case, if you only want to affect the socket instances on the given node, you need to use the local flag:

// make all Socket instances that are currently connected on the given node disconnect
io.local.disconnectSockets();

See here.

server.emit(eventName[, ...args])
History
eventName <string> | <symbol>
args any[]
Returns true
Emits an event to all connected clients in the main namespace.

io.emit("hello");

Any number of parameters can be included, and all serializable data structures are supported:

io.emit("hello", 1, "2", { "3": 4 }, Buffer.from([5]));

And on the receiving side:

socket.on("hello", (arg1, arg2, arg3, arg4) => {
  console.log(arg1); // 1
  console.log(arg2); // "2"
  console.log(arg3); // { "3": 4 }
  console.log(arg4); // ArrayBuffer or Buffer, depending on the platform
});

info
The arguments will automatically be serialized, so calling JSON.stringify() is not needed.

You can use to() and except() to send the packet to specific clients:

// the “hello” event will be broadcast to all connected clients that are either
// in the "room1" room or in the "room2" room, excluding those in the "room3" room
io.to("room1").to("room2").except("room3").emit("hello");

Starting with version 4.5.0, it is now possible to use acknowledgements when broadcasting:

io.timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

caution
Calling timeout() is mandatory in that case.

server.emitWithAck(eventName[, ...args])
Added in v4.6.0

eventName <string> | <symbol>
args any[]
Returns Promise<any[]>
Promised-based version of broadcasting and expecting an acknowledgement from all targeted clients:

try {
  const responses = await io.timeout(10000).emitWithAck("some-event");
  console.log(responses); // one response per client
} catch (e) {
  // some clients did not acknowledge the event in the given delay
}

The example above is equivalent to:

io.timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

And on the receiving side:

socket.on("some-event", (callback) => {
  callback("got it"); // only one argument is expected
});

server.except(rooms)
Added in v4.0.0

rooms <string> | <string[]>
Returns BroadcastOperator
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have not joined the given rooms.

// the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
io.except("room-101").emit("foo", "bar");

// with an array of rooms
io.except(["room-101", "room-102"]).emit("foo", "bar");

// with multiple chained calls
io.except("room-101").except("room-102").emit("foo", "bar");

server.fetchSockets()
Added in v4.0.0

Alias for io.of("/").fetchSocket().

// return all Socket instances of the main namespace
const sockets = await io.fetchSockets();

// return all Socket instances in the "room1" room of the main namespace
const sockets = await io.in("room1").fetchSockets();

Sample usage:

io.on("connection", (socket) => {
  const userId = computeUserId(socket);

  socket.join(userId);

  socket.on("disconnect", async () => {
    const sockets = await io.in(userId).fetchSockets();
    if (sockets.length === 0) {
      // no more active connections for the given user
    }
  });
});

tip
This method also works within a cluster of multiple Socket.IO servers, with a compatible adapter like the Postgres adapter.

In that case, if you only want to return the socket instances on the given node, you need to use the local flag:

// return all Socket instances that are currently connected on the given node
const sockets = await io.local.fetchSockets();

See here.

server.in(room)
Added in v1.0.0

Synonym of server.to(room), but might feel clearer in some cases:

// disconnect all clients in the "room-101" room
io.in("room-101").disconnectSockets();

server.listen(httpServer[, options])
Synonym of server.attach(httpServer[, options]).

server.listen(port[, options])
Synonym of server.attach(port[, options]).

server.of(nsp)
nsp <string> | <RegExp> | <Function>
Returns <Namespace>
Initializes and retrieves the given Namespace by its pathname identifier nsp. If the namespace was already initialized it returns it immediately.

const adminNamespace = io.of("/admin");

A regex or a function can also be provided, in order to create namespace in a dynamic way:

const dynamicNsp = io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === "/dynamic-101"

  // broadcast to all clients in the given sub-namespace
  newNamespace.emit("hello");
});

// client-side
const socket = io("/dynamic-101");

// broadcast to all clients in each sub-namespace
dynamicNsp.emit("hello");

// use a middleware for each sub-namespace
dynamicNsp.use((socket, next) => { /* ... */ });

With a function:

io.of((name, query, next) => {
  // the checkToken method must return a boolean, indicating whether the client is able to connect or not.
  next(null, checkToken(query.token));
}).on("connection", (socket) => { /* ... */ });

server.on(eventName, listener)
Inherited from the EventEmitter class.

eventName <string> | <symbol>
listener <Function>
Returns <Server>
Adds the listener function to the end of the listeners array for the event named eventName.

Available events:

connection
new_namespace
any custom event from the serverSideEmit method
io.on("connection", (socket) => {
  // ...
});

server.onconnection(socket)
socket <engine.Socket>
Returns <Server>
Advanced use only. Creates a new socket.io client from the incoming engine.io (or compatible API) Socket.

import { Server } from "socket.io";
import { Server as Engine } from "engine.io";

const engine = new Engine();
const io = new Server();

engine.on("connection", (socket) => {
  io.onconnection(socket);
});

engine.listen(3000);

server.path([value])
value <string>
Returns <Server> | <string>
Sets the path value under which engine.io and the static files will be served. Defaults to /socket.io/. If no arguments are supplied this method returns the current value.

import { Server } from "socket.io";

const io = new Server();

io.path("/myownpath/");

danger
The path value must match the one on the client side:

import { io } from "socket.io-client";

const socket = io({
  path: "/myownpath/"
});

server.serveClient([value])
value <boolean>
Returns <Server> | <boolean>
If value is true the attached server will serve the client files. Defaults to true. This method has no effect after listen is called. If no arguments are supplied this method returns the current value.

import { Server } from "socket.io";

const io = new Server();

io.serveClient(false);

io.listen(3000);

server.serverSideEmit(eventName[, ...args][, ack])
Added in v4.1.0

Alias for: io.of("/").serverSideEmit(/* ... */);

eventName <string>
args <any[]>
ack <Function>
Returns true
Sends a message to the other Socket.IO servers of the cluster.

Syntax:

io.serverSideEmit("hello", "world");

And on the receiving side:

io.on("hello", (arg1) => {
  console.log(arg1); // prints "world"
});

Acknowledgements are supported too:

// server A
io.serverSideEmit("ping", (err, responses) => {
  console.log(responses[0]); // prints "pong"
});

// server B
io.on("ping", (cb) => {
  cb("pong");
});

Notes:

the connection, connect and new_namespace strings are reserved and cannot be used in your application.

you can send any number of arguments, but binary structures are currently not supported (the array of arguments will be JSON.stringify-ed)

Example:

io.serverSideEmit("hello", "world", 1, "2", { 3: "4" });

the acknowledgement callback might be called with an error, if the other Socket.IO servers do not respond after a given delay
io.serverSideEmit("ping", (err, responses) => {
  if (err) {
    // at least one Socket.IO server has not responded
    // the 'responses' array contains all the responses already received though
  } else {
    // success! the 'responses' array contains one object per other Socket.IO server in the cluster
  }
});

server.serverSideEmitWithAck(eventName[, ...args])
Added in v4.6.0

Alias for: io.of("/").serverSideEmitWithAck(/* ... */);

eventName <string>
args <any[]>
ack <Function>
Returns Promise<any[]>
Promised-based version of broadcasting and expecting an acknowledgement from the other Socket.IO servers of the cluster.

try {
  const responses = await io.serverSideEmitWithAck("some-event");
  console.log(responses); // one response per server (except itself)
} catch (e) {
  // some servers did not acknowledge the event in the given delay
}

The example above is equivalent to:

io.serverSideEmit("some-event", (err, responses) => {
  if (err) {
    // some servers did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per server (except itself)
  }
});

And on the receiving side:

io.on("some-event", (callback) => {
  callback("got it"); // only one argument is expected
});

server.socketsJoin(rooms)
Added in v4.0.0

Alias for io.of("/").socketsJoin(rooms).

// make all Socket instances join the "room1" room
io.socketsJoin("room1");

// make all Socket instances in the "room1" room join the "room2" and "room3" rooms
io.in("room1").socketsJoin(["room2", "room3"]);

// this also works with a single socket ID
io.in(theSocketId).socketsJoin("room1");

tip
This method also works within a cluster of multiple Socket.IO servers, with a compatible adapter like the Postgres adapter.

In that case, if you only want to affect the socket instances on the given node, you need to use the local flag:

// make all Socket instances that are currently connected on the given node join the "room1" room
io.local.socketsJoin("room1");

See here.

server.socketsLeave(rooms)
Added in v4.0.0

Alias for io.of("/").socketsLeave(rooms).

// make all Socket instances leave the "room1" room
io.socketsLeave("room1");

// make all Socket instances in the "room1" room leave the "room2" and "room3" rooms
io.in("room1").socketsLeave(["room2", "room3"]);

// this also works with a single socket ID
io.in(theSocketId).socketsLeave("room1");

tip
This method also works within a cluster of multiple Socket.IO servers, with a compatible adapter like the Postgres adapter.

In that case, if you only want to affect the socket instances on the given node, you need to use the local flag:

// make all Socket instances that are currently connected on the given node leave the "room1" room
io.local.socketsLeave("room1");

See here.

server.timeout(value)
Added in v4.5.0

value <number>
Returns BroadcastOperator
Sets a modifier for a subsequent event emission that the callback will be called with an error when the given number of milliseconds have elapsed without an acknowledgement from all targeted clients:

io.timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

server.to(room)
History
room <string> | <string[]>
Returns BroadcastOperator for chaining
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have joined the given room.

To emit to multiple rooms, you can call to several times.

// the “foo” event will be broadcast to all connected clients in the “room-101” room
io.to("room-101").emit("foo", "bar");

// with an array of rooms (a client will be notified at most once)
io.to(["room-101", "room-102"]).emit("foo", "bar");

// with multiple chained calls
io.to("room-101").to("room-102").emit("foo", "bar");

server.use(fn)
Added in v1.0.0

Alias for io.of("/").use(fn).

fn <Function>
Registers a middleware for the main namespace, which is a function that gets executed for every incoming Socket, and receives as parameters the socket and a function to optionally defer execution to the next registered middleware.

Errors passed to middleware callbacks are sent as special connect_error packets to clients.

Server

io.use((socket, next) => {
  const err = new Error("not authorized");
  err.data = { content: "Please retry later" }; // additional details
  next(err);
});

Client

socket.on("connect_error", err => {
  console.log(err instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});

More information can be found here.

info
If you are looking for Express middlewares, please check this section.

Namespace
Namespace in the class diagram for the server
Represents a pool of sockets connected under a given scope identified by a pathname (eg: /chat).

More information can be found here.

Attributes
namespace.adapter
<Adapter>
The "Adapter" used for the namespace.

Note: the adapter of the main namespace can be accessed with io.of("/").adapter.

More information about it here.

const adapter = io.of("/my-namespace").adapter;

namespace.name
<string>
The namespace identifier property.

namespace.sockets
Map<SocketId, Socket>
A map of Socket instances that are connected to this namespace.

// number of sockets in this namespace (on this node)
const socketCount = io.of("/admin").sockets.size;

Events
Event: 'connect'
Synonym of Event: "connection".

Event: 'connection'
socket <Socket>
Fired upon a connection from client.

// main namespace
io.on("connection", (socket) => {
  // ...
});

// custom namespace
io.of("/admin").on("connection", (socket) => {
  // ...
});

Methods
namespace.allSockets()
Returns Promise<Set<SocketId>>
caution
This method will be removed in the next major release, please use serverSideEmit() or fetchSockets() instead.

Gets a list of socket IDs connected to this namespace (across all nodes if applicable).

// all sockets in the main namespace
const ids = await io.allSockets();

// all sockets in the main namespace and in the "user:1234" room
const ids = await io.in("user:1234").allSockets();

// all sockets in the "chat" namespace
const ids = await io.of("/chat").allSockets();

// all sockets in the "chat" namespace and in the "general" room
const ids = await io.of("/chat").in("general").allSockets();

namespace.disconnectSockets([close])
Added in v4.0.0

close <boolean> whether to close the underlying connection
Returns void
Makes the matching Socket instances disconnect.

// make all Socket instances disconnect
io.disconnectSockets();

// make all Socket instances in the "room1" room disconnect (and discard the low-level connection)
io.in("room1").disconnectSockets(true);

// make all Socket instances in the "room1" room of the "admin" namespace disconnect
io.of("/admin").in("room1").disconnectSockets();

// this also works with a single socket ID
io.of("/admin").in(theSocketId).disconnectSockets();

namespace.emit(eventName[, ...args])
History
eventName <string> | <symbol>
args any[]
Returns true
Emits an event to all connected clients in the given namespace.

io.of("/chat").emit("hello");

Any number of parameters can be included, and all serializable data structures are supported:

io.of("/chat").emit("hello", 1, "2", { "3": 4 }, Buffer.from([5]));

And on the receiving side:

socket.on("hello", (arg1, arg2, arg3, arg4) => {
  console.log(arg1); // 1
  console.log(arg2); // "2"
  console.log(arg3); // { "3": 4 }
  console.log(arg4); // ArrayBuffer or Buffer, depending on the platform
});

info
The arguments will automatically be serialized, so calling JSON.stringify() is not needed.

You can use to() and except() to send the packet to specific clients:

// the “hello” event will be broadcast to all connected clients that are either
// in the "room1" room or in the "room2" room, excluding those in the "room3" room
io.of("/chat").to("room1").to("room2").except("room3").emit("hello");

Starting with version 4.5.0, it is now possible to use acknowledgements when broadcasting:

io.of("/chat").timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

caution
Calling timeout() is mandatory in that case.

namespace.emitWithAck(eventName[, ...args])
Added in v4.6.0

eventName <string> | <symbol>
args any[]
Returns Promise<any[]>
Promised-based version of broadcasting and expecting an acknowledgement from all targeted clients in the given namespace:

try {
  const responses = await io.of("/chat").timeout(10000).emitWithAck("some-event");
  console.log(responses); // one response per client
} catch (e) {
  // some clients did not acknowledge the event in the given delay
}

The example above is equivalent to:

io.of("/chat").timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

And on the receiving side:

socket.on("some-event", (callback) => {
  callback("got it"); // only one argument is expected
});

namespace.except(rooms)
Added in v4.0.0

rooms <string> | <string[]>
Returns BroadcastOperator
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have not joined the given rooms.

const myNamespace = io.of("/my-namespace");

// the "foo" event will be broadcast to all connected clients, except the ones that are in the "room-101" room
myNamespace.except("room-101").emit("foo", "bar");

// with an array of rooms
myNamespace.except(["room-101", "room-102"]).emit("foo", "bar");

// with multiple chained calls
myNamespace.except("room-101").except("room-102").emit("foo", "bar");

namespace.fetchSockets()
Added in v4.0.0

Returns Socket[] | RemoteSocket[]
Returns the matching Socket instances:

// return all Socket instances in the main namespace
const sockets = await io.fetchSockets();

// return all Socket instances in the "room1" room of the main namespace
const sockets = await io.in("room1").fetchSockets();

// return all Socket instances in the "room1" room of the "admin" namespace
const sockets = await io.of("/admin").in("room1").fetchSockets();

// this also works with a single socket ID
const sockets = await io.in(theSocketId).fetchSockets();

The sockets variable in the example above is an array of objects exposing a subset of the usual Socket class:

for (const socket of sockets) {
  console.log(socket.id);
  console.log(socket.handshake);
  console.log(socket.rooms);
  console.log(socket.data);
  socket.emit(/* ... */);
  socket.join(/* ... */);
  socket.leave(/* ... */);
  socket.disconnect(/* ... */);
}

The data attribute is an arbitrary object that can be used to share information between Socket.IO servers:

// server A
io.on("connection", (socket) => {
  socket.data.username = "alice";
});

// server B
const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"

Important note: this method (and socketsJoin, socketsLeave and disconnectSockets too) is compatible with the Redis adapter (starting with socket.io-redis@6.1.0), which means that they will work across Socket.IO servers.

namespace.in(room)
Added in v1.0.0

Synonym of namespace.to(room), but might feel clearer in some cases:

const myNamespace = io.of("/my-namespace");

// disconnect all clients in the "room-101" room
myNamespace.in("room-101").disconnectSockets();

namespace.serverSideEmit(eventName[, ...args][, ack])
Added in v4.1.0

eventName <string>
args <any[]>
ack <Function>
Returns true
Sends a message to the other Socket.IO servers of the cluster.

Syntax:

io.of("/chat").serverSideEmit("hello", "world");

And on the receiving side:

io.of("/chat").on("hello", (arg1) => {
  console.log(arg1); // prints "world"
});

Acknowledgements are supported too:

// server A
io.of("/chat").serverSideEmit("ping", (err, responses) => {
  console.log(responses[0]); // prints "pong"
});

// server B
io.of("/chat").on("ping", (cb) => {
  cb("pong");
});

Notes:

the connection, connect and new_namespace strings are reserved and cannot be used in your application.

you can send any number of arguments, but binary structures are currently not supported (the array of arguments will be JSON.stringify-ed)

Example:

io.of("/chat").serverSideEmit("hello", "world", 1, "2", { 3: "4" });

the acknowledgement callback might be called with an error, if the other Socket.IO servers do not respond after a given delay
io.of("/chat").serverSideEmit("ping", (err, responses) => {
  if (err) {
    // at least one Socket.IO server has not responded
    // the 'responses' array contains all the responses already received though
  } else {
    // success! the 'responses' array contains one object per other Socket.IO server in the cluster
  }
});

namespace.serverSideEmitWithAck(eventName[, ...args])
Added in v4.6.0

eventName <string>
args <any[]>
ack <Function>
Returns Promise<any[]>
Promised-based version of broadcasting and expecting an acknowledgement from the other Socket.IO servers of the cluster.

try {
  const responses = await io.of("/chat").serverSideEmitWithAck("some-event");
  console.log(responses); // one response per server (except itself)
} catch (e) {
  // some servers did not acknowledge the event in the given delay
}

The example above is equivalent to:

io.of("/chat").serverSideEmit("some-event", (err, responses) => {
  if (err) {
    // some servers did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per server (except itself)
  }
});

And on the receiving side:

io.of("/chat").on("some-event", (callback) => {
  callback("got it"); // only one argument is expected
});

namespace.socketsJoin(rooms)
Added in v4.0.0

rooms <string> | <string[]>
Returns void
Makes the matching Socket instances join the specified rooms:

// make all Socket instances join the "room1" room
io.socketsJoin("room1");

// make all Socket instances in the "room1" room join the "room2" and "room3" rooms
io.in("room1").socketsJoin(["room2", "room3"]);

// make all Socket instances in the "room1" room of the "admin" namespace join the "room2" room
io.of("/admin").in("room1").socketsJoin("room2");

// this also works with a single socket ID
io.in(theSocketId).socketsJoin("room1");

More information can be found here.

namespace.socketsLeave(rooms)
Added in v4.0.0

rooms <string> | <string[]>
Returns void
Makes the matching Socket instances leave the specified rooms:

// make all Socket instances leave the "room1" room
io.socketsLeave("room1");

// make all Socket instances in the "room1" room leave the "room2" and "room3" rooms
io.in("room1").socketsLeave(["room2", "room3"]);

// make all Socket instances in the "room1" room of the "admin" namespace leave the "room2" room
io.of("/admin").in("room1").socketsLeave("room2");

// this also works with a single socket ID
io.in(theSocketId).socketsLeave("room1");

namespace.timeout(value)
Added in v4.5.0

value <number>
Returns BroadcastOperator
Sets a modifier for a subsequent event emission that the callback will be called with an error when the given number of milliseconds have elapsed without an acknowledgement from the client:

io.of("/chat").timeout(10000).emit("some-event", (err, responses) => {
  if (err) {
    // some clients did not acknowledge the event in the given delay
  } else {
    console.log(responses); // one response per client
  }
});

namespace.to(room)
History
room <string> | <string[]>
Returns BroadcastOperator for chaining
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have joined the given room.

To emit to multiple rooms, you can call to several times.

const myNamespace = io.of("/my-namespace");

// the “foo” event will be broadcast to all connected clients in the “room-101” room
myNamespace.to("room-101").emit("foo", "bar");

// with an array of rooms (a client will be notified at most once)
myNamespace.to(["room-101", "room-102"]).emit("foo", "bar");

// with multiple chained calls
myNamespace.to("room-101").to("room-102").emit("foo", "bar");

namespace.use(fn)
Added in v1.0.0

fn <Function>
Registers a middleware for the given namespace, which is a function that gets executed for every incoming Socket, and receives as parameters the socket and a function to optionally defer execution to the next registered middleware.

Errors passed to middleware callbacks are sent as special connect_error packets to clients.

Server

io.of("/chat").use((socket, next) => {
  const err = new Error("not authorized");
  err.data = { content: "Please retry later" }; // additional details
  next(err);
});

Client

socket.on("connect_error", err => {
  console.log(err instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});

More information can be found here.

info
If you are looking for Express middlewares, please check this section.

Flags
Flag: 'local'
Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node (when scaling to multiple nodes).

io.local.emit("an event", { some: "data" });

Flag: 'volatile'
Sets a modifier for a subsequent event emission that the event data may be lost if the clients are not ready to receive messages (because of network slowness or other issues, or because they’re connected through long polling and is in the middle of a request-response cycle).

io.volatile.emit("an event", { some: "data" }); // the clients may or may not receive it

Socket
Socket in the class diagram for the server
A Socket is the fundamental class for interacting with browser clients. A Socket belongs to a certain Namespace (by default /) and uses an underlying Client to communicate.

It should be noted the Socket doesn't relate directly to the actual underlying TCP/IP socket and it is only the name of the class.

Within each Namespace, you can also define arbitrary channels (called room) that the Socket can join and leave. That provides a convenient way to broadcast to a group of Sockets (see Socket#to below).

The Socket class inherits from EventEmitter. The Socket class overrides the emit method, and does not modify any other EventEmitter method. All methods documented here which also appear as EventEmitter methods (apart from emit) are implemented by EventEmitter, and documentation for EventEmitter applies.

More information can be found here.

Events
Event: 'disconnect'
reason <string> the reason of the disconnection (either client or server-side)
Fired upon disconnection.

io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    // ...
  });
});

Possible reasons:

Reason	Description
server namespace disconnect	The socket was forcefully disconnected with socket.disconnect().
client namespace disconnect	The client has manually disconnected the socket using socket.disconnect().
server shutting down	The server is, well, shutting down.
ping timeout	The client did not send a PONG packet in the pingTimeout delay.
transport close	The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G).
transport error	The connection has encountered an error.
parse error	The server has received an invalid packet from the client.
forced close	The server has received an invalid packet from the client.
forced server close	The client did not join a namespace in time (see the connectTimeout option) and was forcefully closed.
Event: 'disconnecting'
Added in v1.5.0

reason <string> the reason of the disconnection (either client or server-side)
Fired when the client is going to be disconnected (but hasn't left its rooms yet).

io.on("connection", (socket) => {
  socket.on("disconnecting", (reason) => {
    console.log(socket.rooms); // Set { ... }
  });
});

With an asynchronous handler, you will need to create a copy of the rooms attribute:

io.on("connection", (socket) => {
  socket.on("disconnecting", async (reason) => {
    const rooms = new Set(socket.rooms);

    await someLongRunningOperation();

    // socket.rooms will be empty there
    console.log(rooms);
  });
});

caution
Those events, along with connect, connect_error, newListener and removeListener, are special events that shouldn't be used in your application:

// BAD, will throw an error
socket.emit("disconnect");

Attributes
socket.client
<Client>
A reference to the underlying Client object.

socket.conn
<engine.Socket>
A reference to the underlying Client transport connection (engine.io Socket object). This allows access to the IO transport layer, which still (mostly) abstracts the actual TCP/IP socket.

io.on("connection", (socket) => {
  console.log("initial transport", socket.conn.transport.name); // prints "polling"

  socket.conn.once("upgrade", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log("upgraded transport", socket.conn.transport.name); // prints "websocket"
  });

  socket.conn.on("packet", ({ type, data }) => {
    // called for each packet received
  });

  socket.conn.on("packetCreate", ({ type, data }) => {
    // called for each packet sent
  });

  socket.conn.on("drain", () => {
    // called when the write buffer is drained
  });

  socket.conn.on("heartbeat", () => {
    // called after each round trip of the heartbeat mechanism
    console.log("heartbeat");
  });

  socket.conn.on("close", (reason) => {
    // called when the underlying connection is closed
  });
});

socket.data
Added in v4.0.0

An arbitrary object that can be used in conjunction with the fetchSockets() utility method:

io.on("connection", (socket) => {
  socket.data.username = "alice";
});

const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"

tip
This also works within a Socket.IO cluster, with a compatible adapter like the Postgres adapter.

socket.handshake
<Object>
The handshake details:

Field	Type	Description
headers	IncomingHttpHeaders	The headers sent as part of the handshake.
time	<string>	The date of creation (as string).
address	<string>	The ip address of the client.
xdomain	<boolean>	Whether the connection is cross-domain.
secure	<boolean>	Whether the connection is made over SSL.
issued	<number>	The date of creation (as unix timestamp).
url	<string>	The request URL string.
query	Record<string, string or string[]>	The query parameters of the first request.
auth	Record<string, any>	The authentication payload. See also here.
Usage:

io.use((socket, next) => {
  let handshake = socket.handshake;
  // ...
});

io.on("connection", (socket) => {
  let handshake = socket.handshake;
  // ...
});

Example:

const handshake = {
  headers: {
    "user-agent": "node-XMLHttpRequest",
    accept: "*/*",
    host: "localhost:3000",
    connection: "close"
  },
  time: "Wed Jan 01 2020 01:00:00 GMT+0100 (Central European Standard Time)",
  address: "::ffff:127.0.0.1",
  xdomain: false,
  secure: false,
  issued: 1577836800000,
  url: "/socket.io/?EIO=4&transport=polling&t=OPAfXv5&b64=1",
  query: {
    EIO: "4",
    transport: "polling",
    t: "OPAfXv5",
    b64: "1"
  },
  auth: {}
}

Note: the headers attribute refers to the headers of the first HTTP request of the session, and won't be updated by the subsequent HTTP requests.

io.on("connection", (socket) => {
  console.log(socket.handshake.headers === socket.request.headers); // prints "true"
});

socket.id
<string>
A unique identifier for the session, that comes from the underlying Client.

caution
The id attribute is an ephemeral ID that is not meant to be used in your application (or only for debugging purposes) because:

this ID is regenerated after each reconnection (for example when the WebSocket connection is severed, or when the user refreshes the page)
two different browser tabs will have two different IDs
there is no message queue stored for a given ID on the server (i.e. if the client is disconnected, the messages sent from the server to this ID are lost)
Please use a regular session ID instead (either sent in a cookie, or stored in the localStorage and sent in the auth payload).

See also:

Part II of our private message guide
How to deal with cookies
socket.recovered
Added in v4.6.0

<boolean>
Whether the connection state was successfully recovered during the last reconnection.

io.on("connection", (socket) => {
  if (socket.recovered) {
    // recovery was successful: socket.id, socket.rooms and socket.data were restored
  } else {
    // new or unrecoverable session
  }
});

More information about this feature here.

socket.request
<http.IncomingMessage>
A getter proxy that returns the reference to the request that originated the underlying engine.io Client. Useful for accessing request headers such as Cookie or User-Agent.

import { parse } from "cookie";

io.on("connection", (socket) => {
  const cookies = parse(socket.request.headers.cookie || "");
});

Note: socket.request refers to the first HTTP request of the session, and won't be updated by the subsequent HTTP requests.

io.on("connection", (socket) => {
  console.log(socket.request.headers === socket.handshake.headers); // prints "true"
});

If you don't need this reference, you can discard it in order to reduce the memory footprint:

io.on("connection", (socket) => {
  delete socket.conn.request;
});

socket.rooms
Set<string>
A Set of strings identifying the rooms this client is in.

io.on("connection", (socket) => {

  console.log(socket.rooms); // Set { <socket.id> }

  socket.join("room1");

  console.log(socket.rooms); // Set { <socket.id>, "room1" }

});

Methods
socket.compress(value)
value <boolean> whether to following packet will be compressed
Returns Socket for chaining
Sets a modifier for a subsequent event emission that the event data will only be compressed if the value is true. Defaults to true when you don't call the method.

io.on("connection", (socket) => {
  socket.compress(false).emit("uncompressed", "that's rough");
});

socket.disconnect([close])
close <boolean> whether to close the underlying connection
Returns Socket
Disconnects this socket. If value of close is true, closes the underlying connection. Otherwise, it just disconnects the namespace.

io.on("connection", (socket) => {
  setTimeout(() => socket.disconnect(true), 5000);
});

socket.emit(eventName[, ...args][, ack])
(overrides EventEmitter.emit)

eventName <string> | <symbol>
args <any[]>
ack <Function>
Returns true
Emits an event to the socket identified by the string name. Any other parameters can be included. All serializable data structures are supported, including Buffer.

io.on("connection", () => {
  socket.emit("hello", "world");
  socket.emit("with-binary", 1, "2", { 3: "4", 5: Buffer.from([6]) });
});

The ack argument is optional and will be called with the client's answer.

Server

io.on("connection", (socket) => {
  socket.emit("hello", "world", (response) => {
    console.log(response); // "got it"
  });
});

Client

socket.on("hello", (arg, callback) => {
  console.log(arg); // "world"
  callback("got it");
});

socket.emitWithAck(eventName[, ...args])
Added in v4.6.0

eventName <string> | <symbol>
args any[]
Returns Promise<any>
Promised-based version of emitting and expecting an acknowledgement from the given client:

io.on("connection", async (socket) => {
  // without timeout
  const response = await socket.emitWithAck("hello", "world");

  // with a specific timeout
  try {
    const response = await socket.timeout(10000).emitWithAck("hello", "world");
  } catch (err) {
    // the client did not acknowledge the event in the given delay
  }
});

The example above is equivalent to:

io.on("connection", (socket) => {
  // without timeout
  socket.emit("hello", "world", (val) => {
    // ...
  });

  // with a specific timeout
  socket.timeout(10000).emit("hello", "world", (err, val) => {
    // ...
  });
});

And on the receiving side:

socket.on("hello", (arg1, callback) => {
  callback("got it"); // only one argument is expected
});

socket.eventNames()
Inherited from EventEmitter (along with other methods not mentioned here). See the Node.js documentation for the events module.

socket.except(rooms)
Added in v4.0.0

rooms <string> | <string[]>
Returns BroadcastOperator
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have not joined the given rooms (the socket itself being excluded).

// to all clients except the ones in "room1" and the sender
socket.broadcast.except("room1").emit(/* ... */);

// same as above
socket.except("room1").emit(/* ... */);

// to all clients in "room4" except the ones in "room5" and the sender
socket.to("room4").except("room5").emit(/* ... */);

socket.in(room)
Added in v1.0.0

Synonym of socket.to(room).

socket.join(room)
room <string> | <string[]>
Returns void | Promise
Adds the socket to the given room or to the list of rooms.

io.on("connection", (socket) => {
  socket.join("room 237");
  
  console.log(socket.rooms); // Set { <socket.id>, "room 237" }

  socket.join(["room 237", "room 238"]);

  io.to("room 237").emit("a new user has joined the room"); // broadcast to everyone in the room
});

The mechanics of joining rooms are handled by the Adapter that has been configured (see Server#adapter above), defaulting to socket.io-adapter.

For your convenience, each socket automatically joins a room identified by its id (see Socket#id). This makes it easy to broadcast messages to other sockets:

io.on("connection", (socket) => {
  socket.on("say to someone", (id, msg) => {
    // send a private message to the socket with the given id
    socket.to(id).emit("my message", msg);
  });
});

socket.leave(room)
room <string>
Returns void | Promise
Removes the socket from the given room.

io.on("connection", (socket) => {
  socket.leave("room 237");

  io.to("room 237").emit(`user ${socket.id} has left the room`);
});

info
Rooms are left automatically upon disconnection.

socket.listenersAny()
Returns <Function[]>
Returns the list of registered catch-all listeners.

const listeners = socket.listenersAny();

socket.listenersAnyOutgoing()
Added in v4.5.0

Returns <Function[]>
Returns the list of registered catch-all listeners for outgoing packets.

const listeners = socket.listenersAnyOutgoing();

socket.offAny([listener])
listener <Function>
Removes the previously registered listener. If no listener is provided, all catch-all listeners are removed.

const myListener = () => { /* ... */ };

socket.onAny(myListener);

// then, later
socket.offAny(myListener);

socket.offAny();

socket.offAnyOutgoing([listener])
Added in v4.5.0

listener <Function>
Removes the previously registered listener. If no listener is provided, all catch-all listeners are removed.

const myListener = () => { /* ... */ };

socket.onAnyOutgoing(myListener);

// remove a single listener
socket.offAnyOutgoing(myListener);

// remove all listeners
socket.offAnyOutgoing();

socket.on(eventName, callback)
Inherited from the EventEmitter class.

eventName <string> | <symbol>
callback <Function>
Returns <Socket>
Register a new handler for the given event.

socket.on("news", (data) => {
  console.log(data);
});
// with several arguments
socket.on("news", (arg1, arg2, arg3) => {
  // ...
});
// or with acknowledgement
socket.on("news", (data, callback) => {
  callback(0);
});

socket.onAny(callback)
callback <Function>
Register a new catch-all listener.

socket.onAny((event, ...args) => {
  console.log(`got ${event}`);
});

caution
Acknowledgements are not caught in the catch-all listener.

socket.emit("foo", (value) => {
  // ...
});

socket.onAnyOutgoing(() => {
  // triggered when the event is sent
});

socket.onAny(() => {
  // not triggered when the acknowledgement is received
});

socket.onAnyOutgoing(callback)
Added in v4.5.0

callback <Function>
Register a new catch-all listener for outgoing packets.

socket.onAnyOutgoing((event, ...args) => {
  console.log(`got ${event}`);
});

caution
Acknowledgements are not caught in the catch-all listener.

socket.on("foo", (value, callback) => {
  callback("OK");
});

socket.onAny(() => {
  // triggered when the event is received
});

socket.onAnyOutgoing(() => {
  // not triggered when the acknowledgement is sent
});

socket.once(eventName, listener)
Inherited from EventEmitter (along with other methods not mentioned here). See the Node.js documentation for the events module.

socket.prependAny(callback)
callback <Function>
Register a new catch-all listener. The listener is added to the beginning of the listeners array.

socket.prependAny((event, ...args) => {
  console.log(`got ${event}`);
});

socket.prependAnyOutgoing(callback)
Added in v4.5.0

callback <Function>
Register a new catch-all listener for outgoing packets. The listener is added to the beginning of the listeners array.

socket.prependAnyOutgoing((event, ...args) => {
  console.log(`got ${event}`);
});

socket.removeAllListeners([eventName])
Inherited from EventEmitter (along with other methods not mentioned here). See the Node.js documentation for the events module.

socket.removeListener(eventName, listener)
Inherited from EventEmitter (along with other methods not mentioned here). See the Node.js documentation for the events module.

socket.send([...args][, ack])
args <any[]>
ack <Function>
Returns Socket
Sends a message event. See socket.emit(eventName[, ...args][, ack]).

socket.timeout(value)
Added in v4.4.0

value <number>
Returns <Socket>
Sets a modifier for a subsequent event emission that the callback will be called with an error when the given number of milliseconds have elapsed without an acknowledgement from the client:

socket.timeout(5000).emit("my-event", (err) => {
  if (err) {
    // the client did not acknowledge the event in the given delay
  }
});

socket.to(room)
History
room <string> | <string[]>
Returns Socket for chaining
Sets a modifier for a subsequent event emission that the event will only be broadcast to clients that have joined the given room (the socket itself being excluded).

To emit to multiple rooms, you can call to several times.

io.on("connection", (socket) => {

  // to one room
  socket.to("others").emit("an event", { some: "data" });

  // to multiple rooms
  socket.to("room1").to("room2").emit("hello");

  // or with an array
  socket.to(["room1", "room2"]).emit("hello");

  // a private message to another socket
  socket.to(/* another socket id */).emit("hey");

  // WARNING: `socket.to(socket.id).emit()` will NOT work
  // Please use `io.to(socket.id).emit()` instead.
});

socket.use(fn)
History
fn <Function>
Registers a middleware, which is a function that gets executed for every incoming Packet and receives as parameter the packet and a function to optionally defer execution to the next registered middleware.

Errors passed to the middleware callback are then emitted as error events on the server-side:

io.on("connection", (socket) => {
  socket.use(([event, ...args], next) => {
    if (isUnauthorized(event)) {
      return next(new Error("unauthorized event"));
    }
    // do not forget to call next
    next();
  });

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });
});

Flags
Flag: 'broadcast'
Sets a modifier for a subsequent event emission that the event data will only be broadcast to every sockets but the sender.

io.on("connection", (socket) => {
  socket.broadcast.emit("an event", { some: "data" }); // everyone gets it but the sender
});

Flag: 'volatile'
Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to receive messages (because of network slowness or other issues, or because they’re connected through long polling and is in the middle of a request-response cycle).

io.on("connection", (socket) => {
  socket.volatile.emit("an event", { some: "data" }); // the client may or may not receive it
});

Client
Client in the class diagram for the server
The Client class represents an incoming transport (engine.io) connection. A Client can be associated with many multiplexed Sockets that belong to different Namespaces.

Attributes
client.conn
<engine.Socket>
A reference to the underlying engine.io Socket connection.

client.request
<http.IncomingMessage>
A getter proxy that returns the reference to the request that originated the engine.io connection. Useful for accessing request headers such as Cookie or User-Agent.

Engine
The Engine.IO server, which manages the WebSocket / HTTP long-polling connections. More information here.

Its source code can be found here: https://github.com/socketio/engine.io

Events
Event: 'connection_error'
Added in v4.1.0

error <Error>
io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

This event will be emitted when a connection is abnormally closed. Here is the list of possible error codes:

Code	Message
0	"Transport unknown"
1	"Session ID unknown"
2	"Bad handshake method"
3	"Bad request"
4	"Forbidden"
5	"Unsupported protocol version"
Event: 'headers'
Added in v4.1.0

headers <Object> a hash of headers, indexed by header name
request <http.IncomingMessage> the incoming request
This event will be emitted just before writing the response headers of each HTTP request of the session (including the WebSocket upgrade), allowing you to customize them.

import { serialize, parse } from "cookie";

io.engine.on("headers", (headers, request) => {
  if (!request.headers.cookie) return;
  const cookies = parse(request.headers.cookie);
  if (!cookies.randomId) {
    headers["set-cookie"] = serialize("randomId", "abc", { maxAge: 86400 });
  }
});

Event: 'initial_headers'
Added in v4.1.0

headers <Object> a hash of headers, indexed by header name
request <http.IncomingMessage> the incoming request
This event will be emitted just before writing the response headers of the first HTTP request of the session (the handshake), allowing you to customize them.

import { serialize } from "cookie";

io.engine.on("initial_headers", (headers, request) => {
  headers["set-cookie"] = serialize("uid", "1234", { sameSite: "strict" });
});

If you need to perform some asynchronous operations, you will need to use the allowRequest option:

import { serialize } from "cookie";

const io = new Server(httpServer, {
  allowRequest: async (req, callback) => {
    const session = await fetchSession(req);
    req.session = session;
    callback(null, true);
  }
});

io.engine.on("initial_headers", (headers, req) => {
  if (req.session) {
    headers["set-cookie"] = serialize("sid", req.session.id, { sameSite: "strict" });
  }
});

See also:

how to use with express-session
how to deal with cookies
Attributes
engine.clientsCount
Added in v1.0.0

<number>
The number of currently connected clients.

const count = io.engine.clientsCount;
// may or may not be similar to the count of Socket instances in the main namespace, depending on your usage
const count2 = io.of("/").sockets.size;

Methods
engine.generateId
<Function>
The function used to generate a new session ID. Defaults to base64id.

const uuid = require("uuid");

io.engine.generateId = () => {
  return uuid.v4(); // must be unique across all Socket.IO servers
}

engine.handleUpgrade(request, socket, head)
Added in v1.0.0

request <http.IncomingMessage> the incoming request
socket <stream.Duplex> the network socket between the server and client
head <Buffer> the first packet of the upgraded stream (may be empty)
This method can be used to inject an HTTP upgrade:

Example with both a Socket.IO server and a plain WebSocket server:

import { createServer } from "http";
import { Server as WsServer } from "ws";
import { Server } from "socket.io";

const httpServer = createServer();
const wss = new WsServer({ noServer: true });
const io = new Server(httpServer);

httpServer.removeAllListeners("upgrade");

httpServer.on("upgrade", (req, socket, head) => {
  if (req.url === "/") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else if (req.url.startsWith("/socket.io/")) {
    io.engine.handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

httpServer.listen(3000);

engine.use(middleware)
Added in v4.6.0

<Function>
Adds a new Express middleware.

io.engine.use((req, res, next) => {
  // do something

  next();
});

The middlewares will be called for each incoming HTTP requests, including upgrade requests.

Example with express-session:

import session from "express-session";

io.engine.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

Example with helmet:

import helmet from "helmet";

io.engine.use(helmet());

Client API
IO
The io method is bound to the global scope in the standalone build:

<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();
</script>

An ESM bundle is also available since version 4.3.0:

<script type="module">
  import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";

  const socket = io();
</script>

With an import map:

<script type="importmap">
  {
    "imports": {
      "socket.io-client": "https://cdn.socket.io/4.8.3/socket.io.esm.min.js"
    }
  }
</script>

<script type="module">
  import { io } from "socket.io-client";

  const socket = io();
</script>

Else, in all other cases (with some build tools, in Node.js or React Native), it can be imported from the socket.io-client package:

// ES modules
import { io } from "socket.io-client";

// CommonJS
const { io } = require("socket.io-client");

io.protocol
<number>
The protocol revision number (currently: 5).

The protocol defines the format of the packets exchanged between the client and the server. Both the client and the server must use the same revision in order to understand each other.

You can find more information here.

io([url][, options])
url <string> (defaults to window.location.host)
options <Object>
forceNew <boolean> whether to create a new connection
Returns <Socket>
Creates a new Manager for the given URL, and attempts to reuse an existing Manager for subsequent calls, unless the multiplex option is passed with false. Passing this option is the equivalent of passing "force new connection": true or forceNew: true.

A new Socket instance is returned for the namespace specified by the pathname in the URL, defaulting to /. For example, if the url is http://localhost/users, a transport connection will be established to http://localhost and a Socket.IO connection will be established to /users.

Query parameters can also be provided, either with the query option or directly in the url (example: http://localhost/users?token=abc).

To understand what happens under the hood, the following example:

import { io } from "socket.io-client";

const socket = io("ws://example.com/my-namespace", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123"
  },
  query: {
    "my-key": "my-value"
  }
});

is the short version of:

import { Manager } from "socket.io-client";

const manager = new Manager("ws://example.com", {
  reconnectionDelayMax: 10000,
  query: {
    "my-key": "my-value"
  }
});

const socket = manager.socket("/my-namespace", {
  auth: {
    token: "123"
  }
});

The complete list of available options can be found here.

Manager
Manager in the class diagram for the client
The Manager manages the Engine.IO client instance, which is the low-level engine that establishes the connection to the server (by using transports like WebSocket or HTTP long-polling).

The Manager handles the reconnection logic.

A single Manager can be used by several Sockets. You can find more information about this multiplexing feature here.

Please note that, in most cases, you won't use the Manager directly but use the Socket instance instead.

Constructor
new Manager(url[, options])
url <string>
options <Object>
Returns <Manager>
The complete list of available options can be found here.

import { Manager } from "socket.io-client";

const manager = new Manager("https://example.com");

const socket = manager.socket("/"); // main namespace
const adminSocket = manager.socket("/admin"); // admin namespace

Events
Event: 'error'
error <Error> error object
Fired upon a connection error.

socket.io.on("error", (error) => {
  // ...
});

Event: 'ping'
Fired when a ping packet is received from the server.

socket.io.on("ping", () => {
  // ...
});

Event: 'reconnect'
attempt <number> reconnection attempt number
Fired upon a successful reconnection.

socket.io.on("reconnect", (attempt) => {
  // ...
});

Event: 'reconnect_attempt'
attempt <number> reconnection attempt number
Fired upon an attempt to reconnect.

socket.io.on("reconnect_attempt", (attempt) => {
  // ...
});

Event: 'reconnect_error'
error <Error> error object
Fired upon a reconnection attempt error.

socket.io.on("reconnect_error", (error) => {
  // ...
});

Event: 'reconnect_failed'
Fired when couldn't reconnect within reconnectionAttempts.

socket.io.on("reconnect_failed", () => {
  // ...
});

Methods
manager.connect([callback])
Synonym of manager.open([callback]).

manager.open([callback])
callback <Function>
Returns <Manager>
If the manager was initiated with autoConnect to false, launch a new connection attempt.

The callback argument is optional and will be called once the attempt fails/succeeds.

import { Manager } from "socket.io-client";

const manager = new Manager("https://example.com", {
  autoConnect: false
});

const socket = manager.socket("/");

manager.open((err) => {
  if (err) {
    // an error has occurred
  } else {
    // the connection was successfully established
  }
});

manager.reconnection([value])
value <boolean>
Returns <Manager> | <boolean>
Sets the reconnection option, or returns it if no parameters are passed.

manager.reconnectionAttempts([value])
value <number>
Returns <Manager> | <number>
Sets the reconnectionAttempts option, or returns it if no parameters are passed.

manager.reconnectionDelay([value])
value <number>
Returns <Manager> | <number>
Sets the reconnectionDelay option, or returns it if no parameters are passed.

manager.reconnectionDelayMax([value])
value <number>
Returns <Manager> | <number>
Sets the reconnectionDelayMax option, or returns it if no parameters are passed.

manager.socket(nsp, options)
nsp <string>
options <Object>
Returns <Socket>
Creates a new Socket for the given namespace. Only auth ({ auth: {key: "value"} }) is read from the options object. Other keys will be ignored and should be passed when instancing a new Manager(nsp, options).

manager.timeout([value])
value <number>
Returns <Manager> | <number>
Sets the timeout option, or returns it if no parameters are passed.

Socket
Socket in the class diagram for the client
A Socket is the fundamental class for interacting with the server. A Socket belongs to a certain Namespace (by default /) and uses an underlying Manager to communicate.

A Socket is basically an EventEmitter which sends events to — and receive events from — the server over the network.

socket.emit("hello", { a: "b", c: [] });

socket.on("hey", (...args) => {
  // ...
});

More information can be found here.

Events
Event: 'connect'
This event is fired by the Socket instance upon connection and reconnection.

socket.on("connect", () => {
  // ...
});

caution
Event handlers shouldn't be registered in the connect handler itself, as a new handler will be registered every time the socket instance reconnects:

BAD ⚠️

socket.on("connect", () => {
  socket.on("data", () => { /* ... */ });
});

GOOD 👍

socket.on("connect", () => {
  // ...
});

socket.on("data", () => { /* ... */ });

Event: 'connect_error'
error <Error>
This event is fired upon connection failure.

Reason	Automatic reconnection?
The low-level connection cannot be established (temporary failure)	✅ YES
The connection was denied by the server in a middleware function	❌ NO
The socket.active attribute indicates whether the socket will automatically try to reconnect after a small randomized delay:

socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error.message);
  }
});

Event: 'disconnect'
reason <string>
details <DisconnectDetails>
This event is fired upon disconnection.

socket.on("disconnect", (reason, details) => {
  // ...
});

Here is the list of possible reasons:

Reason	Description	Automatic reconnection?
io server disconnect	The server has forcefully disconnected the socket with socket.disconnect()	❌ NO
io client disconnect	The socket was manually disconnected using socket.disconnect()	❌ NO
ping timeout	The server did not send a PING within the pingInterval + pingTimeout range	✅ YES
transport close	The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)	✅ YES
transport error	The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)	✅ YES
The socket.active attribute indicates whether the socket will automatically try to reconnect after a small randomized delay:

socket.on("disconnect", (reason) => {
  if (socket.active) {
    // temporary disconnection, the socket will automatically try to reconnect
  } else {
    // the connection was forcefully closed by the server or the client itself
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(reason);
  }
});

Attributes
socket.active
<boolean>
Whether the socket will automatically try to reconnect.

This attribute can be used after a connection failure:

socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error.message);
  }
});

Or after a disconnection:

socket.on("disconnect", (reason) => {
  if (socket.active) {
    // temporary disconnection, the socket will automatically try to reconnect
  } else {
    // the connection was forcefully closed by the server or the client itself
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(reason);
  }
});

socket.connected
<boolean>
Whether the socket is currently connected to the server.

const socket = io();

console.log(socket.connected); // false

socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.disconnected
<boolean>
Whether the socket is currently disconnected from the server.

const socket = io();

console.log(socket.disconnected); // true

socket.on("connect", () => {
  console.log(socket.disconnected); // false
});

socket.id
<string>
A unique identifier for the socket session. Set after the connect event is triggered, and updated after the reconnect event.

const socket = io();

console.log(socket.id); // undefined

socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."
});

caution
The id attribute is an ephemeral ID that is not meant to be used in your application (or only for debugging purposes) because:

this ID is regenerated after each reconnection (for example when the WebSocket connection is severed, or when the user refreshes the page)
two different browser tabs will have two different IDs
there is no message queue stored for a given ID on the server (i.e. if the client is disconnected, the messages sent from the server to this ID are lost)
Please use a regular session ID instead (either sent in a cookie, or stored in the localStorage and sent in the auth payload).

See also:

Part II of our private message guide
How to deal with cookies
socket.io
<Manager>
A reference to the underlying Manager.

socket.on("connect", () => {
  const engine = socket.io.engine;
  console.log(engine.transport.name); // in most cases, prints "polling"

  engine.once("upgrade", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log(engine.transport.name); // in most cases, prints "websocket"
  });

  engine.on("packet", ({ type, data }) => {
    // called for each packet received
  });

  engine.on("packetCreate", ({ type, data }) => {
    // called for each packet sent
  });

  engine.on("drain", () => {
    // called when the write buffer is drained
  });

  engine.on("close", (reason) => {
    // called when the underlying connection is closed
  });
});

socket.recovered
Added in v4.6.0

<boolean>
Whether the connection state was successfully recovered during the last reconnection.

socket.on("connect", () => {
  if (socket.recovered) {
    // any event missed during the disconnection period will be received now
  } else {
    // new or unrecoverable session
  }
});

More information about this feature here.

Methods
socket.close()
Added in v1.0.0

Synonym of socket.disconnect().

socket.compress(value)
value <boolean>
Returns <Socket>
Sets a modifier for a subsequent event emission that the event data will only be compressed if the value is true. Defaults to true when you don't call the method.

socket.compress(false).emit("an event", { some: "data" });

socket.connect()
Added in v1.0.0

Returns Socket
Manually connects the socket.

const socket = io({
  autoConnect: false
});

// ...
socket.connect();

It can also be used to manually reconnect:

socket.on("disconnect", () => {
  socket.connect();
});

socket.disconnect()
Added in v1.0.0

Returns <Socket>
Manually disconnects the socket. In that case, the socket will not try to reconnect.

Associated disconnection reason:

client-side: "io client disconnect"
server-side: "client namespace disconnect"
If this is the last active Socket instance of the Manager, the low-level connection will be closed.

socket.emit(eventName[, ...args][, ack])
eventName <string> | <symbol>
args <any[]>
ack <Function>
Returns true
Emits an event to the socket identified by the string name. Any other parameters can be included. All serializable data structures are supported, including Buffer.

socket.emit("hello", "world");
socket.emit("with-binary", 1, "2", { 3: "4", 5: Buffer.from([6, 7, 8]) });

The ack argument is optional and will be called with the server answer.

Client

socket.emit("hello", "world", (response) => {
  console.log(response); // "got it"
});

Server

io.on("connection", (socket) => {
  socket.on("hello", (arg, callback) => {
    console.log(arg); // "world"
    callback("got it");
  });
});

socket.emitWithAck(eventName[, ...args])
Added in v4.6.0

eventName <string> | <symbol>
args any[]
Returns Promise<any>
Promised-based version of emitting and expecting an acknowledgement from the server:

// without timeout
const response = await socket.emitWithAck("hello", "world");

// with a specific timeout
try {
  const response = await socket.timeout(10000).emitWithAck("hello", "world");
} catch (err) {
  // the server did not acknowledge the event in the given delay
}

The example above is equivalent to:

// without timeout
socket.emit("hello", "world", (val) => {
  // ...
});

// with a specific timeout
socket.timeout(10000).emit("hello", "world", (err, val) => {
  // ...
});

And on the receiving side:

io.on("connection", (socket) => {
  socket.on("hello", (arg1, callback) => {
    callback("got it"); // only one argument is expected
  });
});

caution
Environments that do not support Promises will need to add a polyfill in order to use this feature.

socket.listeners(eventName)
Inherited from the EventEmitter class.

eventName <string> | <symbol>
Returns <Function[]>
Returns the array of listeners for the event named eventName.

socket.on("my-event", () => {
  // ...
});

console.log(socket.listeners("my-event")); // prints [ [Function] ]

socket.listenersAny()
Added in v3.0.0

Returns <Function[]>
Returns the list of registered catch-all listeners.

const listeners = socket.listenersAny();

socket.listenersAnyOutgoing()
Added in v4.5.0

Returns <Function[]>
Returns the list of registered catch-all listeners for outgoing packets.

const listeners = socket.listenersAnyOutgoing();

socket.off([eventName][, listener])
Inherited from the EventEmitter class.

eventName <string> | <symbol>
listener <Function>
Returns <Socket>
Removes the specified listener from the listener array for the event named eventName.

const myListener = () => {
  // ...
}

socket.on("my-event", myListener);

// then later
socket.off("my-event", myListener);

The listener argument can also be omitted:

// remove all listeners for that event
socket.off("my-event");

// remove all listeners for all events
socket.off();

socket.offAny([listener])
Added in v3.0.0

listener <Function>
Removes the previously registered listener. If no listener is provided, all catch-all listeners are removed.

const myListener = () => { /* ... */ };

socket.onAny(myListener);

// then, later
socket.offAny(myListener);

socket.offAny();

socket.offAnyOutgoing([listener])
Added in v4.5.0

listener <Function>
Removes the previously registered listener. If no listener is provided, all catch-all listeners are removed.

const myListener = () => { /* ... */ };

socket.onAnyOutgoing(myListener);

// remove a single listener
socket.offAnyOutgoing(myListener);

// remove all listeners
socket.offAnyOutgoing();

socket.on(eventName, callback)
Inherited from the EventEmitter class.

eventName <string> | <symbol>
listener <Function>
Returns <Socket>
Register a new handler for the given event.

socket.on("news", (data) => {
  console.log(data);
});

// with multiple arguments
socket.on("news", (arg1, arg2, arg3, arg4) => {
  // ...
});
// with callback
socket.on("news", (cb) => {
  cb(0);
});

socket.onAny(callback)
Added in v3.0.0

callback <Function>
Register a new catch-all listener.

socket.onAny((event, ...args) => {
  console.log(`got ${event}`);
});

caution
Acknowledgements are not caught in the catch-all listener.

socket.emit("foo", (value) => {
  // ...
});

socket.onAnyOutgoing(() => {
  // triggered when the event is sent
});

socket.onAny(() => {
  // not triggered when the acknowledgement is received
});

socket.onAnyOutgoing(callback)
Added in v4.5.0

callback <Function>
Register a new catch-all listener for outgoing packets.

socket.onAnyOutgoing((event, ...args) => {
  console.log(`got ${event}`);
});

caution
Acknowledgements are not caught in the catch-all listener.

socket.on("foo", (value, callback) => {
  callback("OK");
});

socket.onAny(() => {
  // triggered when the event is received
});

socket.onAnyOutgoing(() => {
  // not triggered when the acknowledgement is sent
});

socket.once(eventName, callback)
Inherited from the EventEmitter class.

eventName <string> | <symbol>
listener <Function>
Returns <Socket>
Adds a one-time listener function for the event named eventName. The next time eventName is triggered, this listener is removed and then invoked.

socket.once("my-event", () => {
  // ...
});

socket.open()
Added in v1.0.0

Synonym of socket.connect().

socket.prependAny(callback)
Added in v3.0.0

callback <Function>
Register a new catch-all listener. The listener is added to the beginning of the listeners array.

socket.prependAny((event, ...args) => {
  console.log(`got ${event}`);
});

socket.prependAnyOutgoing(callback)
Added in v4.5.0

callback <Function>
Register a new catch-all listener for outgoing packets. The listener is added to the beginning of the listeners array.

socket.prependAnyOutgoing((event, ...args) => {
  console.log(`got ${event}`);
});

socket.send([...args][, ack])
args <any[]>
ack <Function>
Returns <Socket>
Sends a message event. See socket.emit(eventName[, ...args][, ack]).

socket.timeout(value)
Added in v4.4.0

value <number>
Returns <Socket>
Sets a modifier for a subsequent event emission that the callback will be called with an error when the given number of milliseconds have elapsed without an acknowledgement from the server:

socket.timeout(5000).emit("my-event", (err) => {
  if (err) {
    // the server did not acknowledge the event in the given delay
  }
});

Flags
Flag: 'volatile'
Added in v3.0.0

Sets a modifier for the subsequent event emission indicating that the packet may be dropped if:

the socket is not connected
the low-level transport is not writable (for example, when a POST request is already running in HTTP long-polling mode)
socket.volatile.emit(/* ... */); // the server may or may not receive it