var io = require("socket.io-client");
var io_server = require("socket.io").listen(3000);
var chai = require("chai");

describe("sockets tests", function() {
  var socket;
  beforeEach(function(done) {
    // Setup
    socket = io.connect(
      "http://localhost:3000",
      {
        "reconnection delay": 0,
        "reopen delay": 0,
        "force new connection": true,
        transports: ["websocket"]
      }
    );

    socket.on("connect", () => {
      done();
    });

    socket.on("disconnect", () => {
      // console.log('disconnected...');
    });
  });

  afterEach(done => {
    // Cleanup
    if (socket.connected) {
      socket.disconnect();
    }
    io_server.close();
    done();
  });

  it("should communicate", done => {
    // once connected, emit Hello World
    io_server.emit("echo", "Hello World");

    socket.once("echo", message => {
      // Check that the message matches
      chai.expect(message).to.equal("Hello World");
      done();
    });

    io_server.on("connection", socket => {
      chai.expect(socket).to.not.be.null;
    });
  });
});
