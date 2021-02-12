//require our websocket library
var WebSocketServer = require("ws").Server;

//creating a websocket server at port 9090
var wss = new WebSocketServer({ port: 9090 });

//all connected to the server users
var games = {};

//when a user connects to our sever
wss.on("connection", function (connection) {
  console.log("User connected");

  //when server gets a message from a connected user
  connection.on("message", function (message) {
    var data;
    //accepting only JSON messages
    try {
      data = JSON.parse(message);
      console.log(`Received message of type ${data.type}`);
    } catch (e) {
      console.log("Invalid JSON");
      data = {};
    }

    //switching type of the user message
    switch (data.type) {
      case "join":
        var game = games[data.gameCode];

        if (game) {
          if (Object.keys(game.players).length === 1 && !game.players[data.name]) {
            console.log("Joining game: ", data.gameCode);

            game.players[data.name] = connection;
            connection.gameCode = data.gameCode;

            sendTo(connection, {
              type: "joined",
              success: true,
            });
          } else {
            if (Object.keys(game.players).length !== 1) {
              console.log("Join failed due to game full: ", data.gameCode);
            } else {
              console.log("Join failed due to name taken: ", data.gameCode);
            }

            sendTo(connection, {
              type: "joined",
              success: false,
            });
          }
        } else {
          console.log("Game created: ", data.gameCode);

          var game = { players: {} };
          game.players[data.name] = connection;
          games[data.gameCode] = game;
          connection.gameCode = data.gameCode;

          sendTo(connection, {
            type: "created",
            success: true,
          });
        }

        break;

      case "offer":
        var game = games[data.gameCode];

        if (game && Object.keys(game.players).length === 2) {
          console.log(
            `Sending offer from player ${data.name} for ${data.gameCode}`
          );

          var otherConnection = otherPlayerConnection(game, data.name);

          sendTo(otherConnection, {
            type: "offer",
            offer: data.offer,
          });
        } else {
          if (!game) {
            console.log("Game doesn't exist: ", data.gameCode);
          } else {
            console.log("Game doesn't have another player: ", data.gameCode);
          }
        }

        break;

      case "answer":
        var game = games[data.gameCode];

        if (game && Object.keys(game.players).length === 2) {
          console.log(`Sending answer from ${data.name} for ${data.gameCode}`);

          var otherConnection = otherPlayerConnection(game, data.name);

          sendTo(otherConnection, {
            type: "answer",
            answer: data.answer,
          });
        } else {
          if (!game) {
            console.log("Game doesn't exist: ", data.gameCode);
          } else {
            console.log("Game doesn't have another player: ", data.gameCode);
          }
        }

        break;

      case "candidate":
        var game = games[data.gameCode];

        if (game && Object.keys(game.players).length === 2) {
          console.log(
            `Sending candidate from ${data.name} for ${data.gameCode}`
          );

          var otherConnection = otherPlayerConnection(game, data.name);

          sendTo(otherConnection, {
            type: "candidate",
            candidate: data.candidate,
          });
        } else {
          if (!game) {
            console.log("Game doesn't exist: ", data.gameCode);
          } else {
            console.log("Game doesn't have another player: ", data.gameCode);
          }
        }

        break;

      case "leave":
        var game = games[data.gameCode];

        if (game && Object.keys(game.players).length === 2) {
          console.log(`Player ${data.name} is leaving game ${data.gameCode}`);

          var otherConnection = otherPlayerConnection(game, data.name);

          sendTo(otherConnection, {
            type: "leave",
          });
        } else {
          if (!game) {
            console.log("Game doesn't exist: ", data.gameCode);
          } else {
            console.log("Game doesn't have another player: ", data.gameCode);
          }
        }

        break;

      default:
        sendTo(connection, {
          type: "error",
          message: "Command not found: " + data.type,
        });

        break;
    }
  });

  //when user exits, for example closes a browser window
  //this may help if we are still in "offer","answer" or "candidate" state
  connection.on("close", function () {
    console.log("Handling connection closed");

    if (connection.gameCode && games[connection.gameCode]) {
      var gameCode = connection.gameCode;
      console.log(`Connection closed on ${gameCode}`);

      var game = games[gameCode]
      var playerName = Object.keys(game.players).find(name => {
        return game.players[name] === connection;
      })
      delete game.players[playerName]

      if (Object.keys(game.players).length === 0) {
        console.log(`Deleting game ${gameCode}`);

        delete games[gameCode];
      } else {
        console.log(`Notifying other player ${gameCode}`);

        var otherConnection = otherPlayerConnection(game, playerName)

        sendTo(otherConnection, {
          type: "leave",
        });
      }
    }
  });
});

function otherPlayerConnection(game, playerName) {
  var otherPlayerName = Object.keys(game.players).find((name) => {
    return name !== playerName;
  });

  return game.players[otherPlayerName];
}

function sendTo(connection, message) {
  connection.send(JSON.stringify(message));
}
