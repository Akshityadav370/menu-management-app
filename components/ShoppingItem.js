import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, db, deleteDoc } from "@/firebase/index";

// Shopping List -> Shopping Items[]
// Shopping Item
/* 
    1. id
    2. title
    3. isChecked
*/

// Menu Item
/*
    1. id
    2. title
    3. Description
    4. status(active/inactive) => toggle
    // UI
    5. Delete 
    6. Edit
 */

const ShoppingItem = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const updateIsChecked = async () => {
    const shoppingRef = doc(db, "shopping", props.id);

    await updateDoc(shoppingRef, {
      isChecked: isChecked,
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteShoppingItem,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const deleteShoppingItem = async () => {
    await deleteDoc(doc(db, "shopping", props.id));
    props.getShoppingList();
  };

  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" size={24} color="black" />
        ) : (
          <AntDesign name="checkcircleo" size={24} color="black" />
        )}
      </Pressable>
      <Text style={styles.title}>{props.title}</Text>
      <Pressable onPress={confirmDelete}>
        <AntDesign name="delete" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default ShoppingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "lightgray",
    marginVertical: 10,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
  },
});