import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Board from "../components/board/board.component";
import { SocketContext } from "../contexts/socket.context";

export default function OnlineGameController({ navigation }) {
  const socket = useContext(SocketContext);

  const [inQueue, setInQueue] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [idOpponent, setIdOpponent] = useState(null);

  useEffect(() => {
    console.log("[emit][queue.join]:", socket.id);
    socket.emit("queue.join");
    setInQueue(false);
    setInGame(false);

    socket.on("queue.added", (data) => {
      console.log("[listen][queue.added]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
    });

    socket.on("game.start", (data) => {
      console.log("[listen][game.start]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
      setIdOpponent(data["idOpponent"]);
    });

    socket.on("queue.left", (data) => {
      console.log("[listen][queue.left]:", data);
      setInQueue(data["inQueue"]);
      setInGame(data["inGame"]);
      navigation.navigate("HomeScreen");
    });
  }, []);

  return (
    <View style={styles.container}>
      {!inQueue && !inGame && (
        <>
          <Text style={styles.paragraph}>Waiting for server datas...</Text>
        </>
      )}

      {inQueue && (
        <>
          <Text style={styles.paragraph}>Waiting for another player...</Text>
          <View>
            <Button
              title="Quittez la file d'attente"
              onPress={() => {
                socket.emit("queue.leave");
              }}
            />
          </View>
        </>
      )}

      {inGame && (
        <>
          <Board />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 16,
  },
});
