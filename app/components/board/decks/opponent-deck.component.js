// app/components/board/decks/opponent-deck.component.js

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import { DiceContext } from "../../../contexts/dice.context";
import Dice from "./dice.component";
import { DiceContext } from "../../../contexts/dice.context";

const OpponentDeck = () => {
  const socket = useContext(SocketContext);
  const { isDiceRolled } = useContext(DiceContext);

  const [displayOpponentDeck, setDisplayOpponentDeck] = useState(false);
  const [opponentDices, setOpponentDices] = useState(Array(5).fill({ value: "", locked: false }));

  useEffect(() => {
    socket.on("game.deck.view-state", (data) => {
      setDisplayOpponentDeck(data["displayOpponentDeck"]);
      if (data["displayOpponentDeck"]) {
        setOpponentDices(data["dices"]);
      }
    });
  }, []);

  return (
    <View style={styles.deckOpponentContainer}>
      {displayOpponentDeck && (
        <View style={styles.diceContainer}>
          {opponentDices.map((diceData, index) => (
            <Dice
              key={index}
              locked={diceData.locked}
              value={diceData.value}
              opponent={true}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "black",
  },
  diceContainer: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default OpponentDeck;
