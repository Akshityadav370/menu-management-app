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
  Modal,
  Switch,
} from "react-native";
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
import MenuItem from "@/components/MenuItem";
const wines = [
  {
    title: "Tea",
    description: " Hot ",
    status: true,
  },
  {
    title: "Hot Coffee",
    description: " Fresh ",
    status: true,
  },
  {
    title: "Cold Coffee",
    description: " Fresh ",
    status: true,
  },
  {
    title: "Ice Tea",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Green Tea",
    description: "Hot | 750 ml",
    status: true,
  },
  {
    title: "Fresh Lime Soda",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Coconut Water",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Seasonal Fresh Juice",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Chocolate Shake",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Oreo Shake",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Banana Shake",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Pineapple Shake",
    description: "Fresh | 750 ml",
    status: true,
  },
  {
    title: "Seasonal Fruit Shake",
    description: "Fresh | 750 ml",
    status: true,
  },
];
export default function HomeScreen() {
  // Items List/Array
  const [menuList, setMenuList] = useState([]);
  const [activeDishes, setActiveDishes] = useState([]);
  const [inactiveDishes, setInactiveDishes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // State variables for adding the menu item
  const [newTitle, setNewTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  // Creating the menu item in cloud firestore
  const addMenuItem = async () => {
    try {
      // wines.forEach(async (wine) => {
      //   await addDoc(collection(db, "menu"), {
      //     title: wine.title,
      //     description: wine.description,
      //     status: wine.status,
      //   });
      // });
      const docRef = await addDoc(collection(db, "menu"), {
        title: newTitle,
        description: description,
        status: status,
      });
      console.log("Document written with ID: ", docRef.id);
      // After creation, setting the state variables back to null
      setNewTitle("");
      setDescription("");
      setStatus(false);
      setModalVisible(false);

      // Call this to re-render the flatlist with the newly added/created item
      getMenuList();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Fetching/Reading the menu items from the firestore
  const getMenuList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      // Storing the fetched items in our state variable
      setMenuList(items);

      // Separating active and inactive dishes from the fetched menu items
      const active = items.filter((item) => item.status);
      const inactive = items.filter((item) => !item.status);
      setActiveDishes(active);
      setInactiveDishes(inactive);

      console.log("***Menu List", items);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  // Deleting all the menu items in the cloud firestore but not the collection
  const deleteAllItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "menu"));
      querySnapshot.forEach((item) => {
        deleteDoc(doc(db, "menu", item.id));
      });
      // Setting our local state variable data to null
      setMenuList([]);
    } catch (e) {
      console.error("Error deleting documents: ", e);
    }
  };

  // Confirmation dialog box before deleting all the items
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

  // Calls the first time our app starts to fetch all the menu items from the cloud firestore
  // Only calls at the first time as the dependency array is empty
  useEffect(() => {
    getMenuList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AntDesign
          name="weibo-circle"
          size={35}
          style={{ marginRight: 7 }}
          color="goldenrod"
        />
        <Text style={styles.heading}>Viraaj Ventures</Text>
        {/* Options (Add, Delete All) */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.headRight}
        >
          <AntDesign
            name="pluscircle"
            size={30}
            style={{ marginRight: 20 }}
            color="olivedrab"
          />
        </Pressable>
        <Pressable onPress={confirmDeleteAllItems}>
          <Text style={styles.clearMenuText}>Clear All</Text>
        </Pressable>
      </View>
      {/* Sub Header */}
      <View style={styles.subHeader}>
        <View style={styles.subHeading1}>
          <Text style={styles.chef}>Chef!</Text>
          <Text style={styles.status}>Here's, What's Cooking Today:</Text>
        </View>
        {/* Active & Inactive Items rendering */}
        <View>
          <View style={styles.dishesContainer}>
            <Text style={styles.dishes}>
              Active Dishes ({activeDishes.length}):{" "}
            </Text>
            <Text style={styles.dishName}>
              {activeDishes.map((dish) => dish.title).join(", ")}
            </Text>
          </View>
          <View style={styles.dishesContainer}>
            <Text style={styles.dishes}>
              Inactive Dishes ({inactiveDishes.length}):{" "}
            </Text>
            <Text style={styles.dishName}>
              {inactiveDishes.map((dish) => dish.title).join(", ")}
            </Text>
          </View>
        </View>
      </View>
      {/* Rendering the menu List through FlatList onto our MenuItem component */}
      {menuList.length > 0 ? (
        <FlatList
          data={menuList}
          renderItem={({ item }) => (
            <MenuItem
              title={item.title}
              desc={item.description}
              status={item.status}
              id={item.id}
              getMenuList={getMenuList}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : menuList.length === 0 ? (
        <Text>No Menu Created</Text>
      ) : (
        <ActivityIndicator />
      )}
      {/* Modal for adding new menu item */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Respective Labels & Input Fields (title, desc, status) */}
            <Text style={styles.modalTitle}>Add Menu Item</Text>
            <TextInput
              placeholder="Title"
              style={styles.modalInput}
              value={newTitle}
              onChangeText={(text) => setNewTitle(text)}
            />
            <TextInput
              placeholder="Description"
              style={styles.modalInput}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Active</Text>
              <Switch
                value={status}
                onValueChange={(value) => setStatus(value)}
              />
            </View>
            {/* Buttons (confirm & cancel) */}
            <Pressable
              style={[styles.button, styles.buttonAdd]}
              onPress={addMenuItem}
            >
              <Text style={styles.textStyle}>Add Item</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    width: "95%",
    alignSelf: "center",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "600",
    flex: 1,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    fontStyle: "italic",
  },
  subHeader: {
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    padding: 10,
    gap: 10,
  },
  subHeading1: { flexDirection: "row", alignItems: "center" },
  chef: {
    color: "goldenrod",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    fontStyle: "italic",
    marginRight: 7,
  },
  status: {
    color: "white",
    fontSize: 19,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
  },
  dishesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  dishes: {
    color: "goldenrod",
    fontSize: 17,
    fontWeight: "500",
  },
  dishName: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    fontStyle: "italic",
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
  headRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  clearMenuText: {
    color: "white",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "orangered",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "lightgrey",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonAdd: {
    backgroundColor: "darkturquoise",
  },
  buttonClose: {
    backgroundColor: "orangered",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
