import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import ShoppingItem from "@/components/ShoppingItem";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  app,
  db,
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "@/firebase/index";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const addShoppingItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "shopping"), {
        title: title,
        isChecked: false,
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
      getShoppingList();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getShoppingList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shopping"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setShoppingList(items);
      console.log("***Shopping List", items);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  const deleteAllItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shopping"));
      querySnapshot.forEach((item) => {
        deleteDoc(doc(db, "shopping", item.id));
      });
      setShoppingList([]);
    } catch (e) {
      console.error("Error deleting documents: ", e);
    }
  };

  const confirmDeleteAllItems = () => {
    Alert.alert(
      "Delete All Items",
      "Are you sure you want to delete all items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteAllItems,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    getShoppingList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Shopping List</Text>
        <Text style={styles.noOfItems}>{shoppingList.length}</Text>
        <Pressable onPress={confirmDeleteAllItems}>
          <AntDesign name="delete" size={24} color="black" />
        </Pressable>
      </View>
      {shoppingList.length > 0 ? (
        <FlatList
          data={shoppingList}
          renderItem={({ item }) => (
            <ShoppingItem
              title={item.title}
              isChecked={item.isChecked}
              id={item.id}
              getShoppingList={getShoppingList}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <ActivityIndicator />
      )}
      <TextInput
        placeholder="Enter Shopping Item..."
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
        onSubmitEditing={addShoppingItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "600",
    flex: 1,
  },
  noOfItems: {
    fontSize: 30,
    fontWeight: "500",
    marginRight: 10,
  },
  input: {
    backgroundColor: "skyblue",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: "auto",
    marginVertical: 10,
  },
});
