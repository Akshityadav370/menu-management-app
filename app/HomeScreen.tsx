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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
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
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import logo from "@/assets/images/Viraaj Ventures Logo.png";
import listLogo from "@/assets/images/list_logo.jpg";
import Constants from "expo-constants";
import { setDoc } from "firebase/firestore";
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
const snacks = [
  {
    title: "Masala French Fries",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Plain French Fries",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Corn & Cheese Nuggets",
    description: "Cheesy | Hot",
    status: true,
  },
  {
    title: "Fresh Cut Fruits",
    description: "Seasonal | Fruits",
    status: true,
  },
  {
    title: "Pizza Pockets",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Veg Mayonnaise Sandwich (White Bread)",
    description: "White Bread",
    status: true,
  },
  {
    title: "Veg Mayonnaise Sandwich (Brown Bread)",
    description: "Brown Bread",
    status: true,
  },
  {
    title: "Veg Mayonnaise Grill Sandwich (Brown Bread)",
    description: "Brown Bread",
    status: true,
  },
  {
    title: "Veg Mayonnaise Grill Sandwich (White Bread)",
    description: "White Bread",
    status: true,
  },
  {
    title: "Veg Cheese Sandwich (Brown Bread)",
    description: "Brown Bread",
    status: true,
  },
  {
    title: "Veg Cheese Sandwich (White Bread)",
    description: "White Bread",
    status: true,
  },
  {
    title: "Potato Bites",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Cheese Balls",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Veggie Fingers",
    description: "Hot | Fresh",
    status: true,
  },
  {
    title: "Potato Wedges",
    description: "Hot | Fresh",
    status: true,
  },
];
export default function HomeScreen(props: any) {
  const router = useRouter();
  // Items List/Array
  const [menuList, setMenuList] = useState<any>([]);
  const [activeDishes, setActiveDishes] = useState([]);
  const [inactiveDishes, setInactiveDishes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // State variables for adding the menu item
  const [newTitle, setNewTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Creating the menu item in cloud firestore
  const addMenuItem = async () => {
    try {
      // Whenever new user comes up!
      // if (menuList.length === 0) {
      // wines.forEach(async (wine) => {
      //   await addDoc(collection(db, "menu"), {
      //     title: wine.title,
      //     description: wine.description,
      //     status: wine.status,
      //   });
      // });
      // snacks.forEach(async (wine) => {
      //   await addDoc(collection(db, "menu"), {
      //     title: wine.title,
      //     description: wine.description,
      //     status: wine.status,
      //   });
      // });
      // return;
      // }
      if (Math.random() > 0.5) {
        const docRef = await addDoc(collection(db, "wines"), {
          title: newTitle,
          description: description,
          tags: description,
          price: "$30",
          status: status,
          type: "wines",
        });
      } else {
        const docRef = await addDoc(collection(db, "cocktails"), {
          title: newTitle,
          description: description,
          tags: description,
          price: "$30",
          status: status,
          type: "cocktails",
        });
      }
      // console.log("Document written with ID: ", docRef.id);
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
      const querySnapshot1 = await getDocs(collection(db, "wines"));
      const items1: any = [];
      querySnapshot1.forEach((doc) => {
        items1.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      const querySnapshot2 = await getDocs(collection(db, "cocktails"));
      const items2: any = [];
      querySnapshot2.forEach((doc) => {
        items2.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      // Storing the fetched items in our state variable
      const combinedItems = [...items1, ...items2];
      setMenuList(combinedItems);

      // if (menuList.length === 0) addMenuItem();

      // Separating active and inactive dishes from the fetched menu items
      const active = menuList.filter((item: any) => item.status);
      const inactive = menuList.filter((item: any) => !item.status);
      setActiveDishes(active);
      setInactiveDishes(inactive);

      // console.log("***Menu List", menuList);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  // Deleting all the menu items in the cloud firestore but not the collection
  const deleteAllItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "wines"));
      querySnapshot.forEach((item) => {
        deleteDoc(doc(db, "wines", item.id));
      });
      // Setting our local state variable data to null
      setMenuList([]);
      setActiveDishes([]);
      setInactiveDishes([]);
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

  const savePushToken = async (token: Notifications.ExpoPushToken) => {
    try {
      // if (!Constants.deviceId) {
      //   console.error("Device ID is undefined");
      //   return;
      // }
      // const tokenRef = doc(db, "pushTokens", Constants.deviceId);
      const tokenRef = doc(db, "pushTokens", "1234");
      await setDoc(tokenRef, { token: token }, { merge: true });
      console.log("Push token saved to database");
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };

  // Calls the first time our app starts to fetch all the menu items from the cloud firestore
  // Only calls at the first time as the dependency array is empty
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        await savePushToken(token);
      } catch (error) {
        console.error("Error registering for push notifications:", error);
      }
    };

    // registerForPushNotifications();
    getMenuList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <AntDesign
          name="weibo-circle"
          size={35}
          style={{ marginRight: 7 }}
          color="goldenrod"
        /> */}
        {/* <Text style={styles.heading}>Viraaj Ventures</Text> */}
        <Image source={logo} style={styles.logo} />
        {/* Options (Add, Delete All) */}
        <View style={styles.headerOptions}>
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
          <Pressable onPress={() => router.push("/OrdersScreen")}>
            <FontAwesome6
              name="clipboard-list"
              size={35}
              style={{ marginLeft: 20 }}
              color="skyblue"
            />
            {/* <Image source={listLogo}></Image> */}
          </Pressable>
        </View>
      </View>
      {/* User Info */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.dishName}>{props.user.email}</Text>
          <AntDesign
            name="logout"
            size={20}
            onPress={props.handleAuthentication}
            color="tomato"
          />
        </View>
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
            <Pressable onPress={() => setShowActive(!showActive)}>
              <Text style={styles.dishes}>
                Active Dishes ({activeDishes.length}){" "}
                {showActive ? (
                  <FontAwesome6
                    name="sort-up"
                    size={24}
                    color="white"
                    style={{ alignSelf: "baseline" }}
                  />
                ) : (
                  <FontAwesome6
                    style={{ alignSelf: "baseline" }}
                    name="sort-down"
                    size={24}
                    color="white"
                  />
                )}
              </Text>
            </Pressable>
            {showActive && (
              <Text style={styles.dishName}>
                {activeDishes.map((dish: any) => dish.title).join(", ")}
              </Text>
            )}
          </View>
          <View style={styles.dishesContainer}>
            <Pressable onPress={() => setShowInactive(!showInactive)}>
              <Text style={styles.dishes}>
                Inactive Dishes ({inactiveDishes.length}){" "}
                {showInactive ? (
                  <FontAwesome6
                    name="sort-up"
                    size={24}
                    color="white"
                    style={{ alignSelf: "baseline" }}
                  />
                ) : (
                  <FontAwesome6
                    style={{ alignSelf: "baseline" }}
                    name="sort-down"
                    size={24}
                    color="white"
                  />
                )}
              </Text>
            </Pressable>
            {showInactive && (
              <Text style={styles.dishName}>
                {inactiveDishes.map((dish: any) => dish.title).join(", ")}
              </Text>
            )}
          </View>
        </View>
      </View>
      {/* Rendering the menu List through FlatList onto our MenuItem component */}
      {menuList.length > 0 ? (
        <FlatList
          data={menuList}
          renderItem={({ item }: any) => (
            <MenuItem
              title={item.title}
              desc={item.description}
              status={item.status}
              id={item.id}
              type={item.type}
              getMenuList={getMenuList}
            />
          )}
          keyExtractor={(item: any) => item.id}
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
  logo: {
    height: 100,
    width: "20%",
    resizeMode: "contain",
  },
  headerOptions: { flexDirection: "row" },
  heading: {
    fontSize: 28,
    fontWeight: "600",
    flex: 1,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    fontStyle: "italic",
  },
  userHeader: {
    // flex: 1,
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  userInfo: {
    // backgroundColor: "yellow",
    flexDirection: "row",
    justifyContent: "space-between",
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
    alignItems: "center",
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
