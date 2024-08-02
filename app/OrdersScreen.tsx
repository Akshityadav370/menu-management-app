import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function OrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);

  const getOrderItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orderItems: any = ([] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })));
      setOrders(orderItems);
    } catch (error) {
      console.error("Error getting order items", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      getOrderItems(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await deleteDoc(orderRef);
      getOrderItems(); // Refresh the orders list
    } catch (error) {
      console.error("Error deleting order", error);
    }
  };

  // Confirmation Dialog Box Before deleting
  const confirmDelete = (tableNo, id) => {
    Alert.alert(
      `Table ${tableNo}`,
      "Are you sure you want to delete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteOrder(id),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "goldenrod";
      case 2:
        return "grey";
      case 3:
        return "skyblue";
      case 4:
        return "yellowgreen";
      default:
        return "white";
    }
  };

  const handlePushCall = async () => {
    // console.log("Push called");
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      console.log("My token:", token.data);

      const message = {
        to: token.data,
        sound: "default",
        title: "Table No 12",
        body: "Paneer Tikka X2",
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  };

  useEffect(() => {
    getOrderItems();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemHeader}>
        <Text style={styles.customerName}>
          Table <Text style={styles.tableNo}>{item.tableNo}</Text>
        </Text>
        <View style={styles.orderPrice}>
          <Pressable onPress={() => confirmDelete(item.tableNo, item.id)}>
            <AntDesign name="delete" size={24} color={"tomato"} />
          </Pressable>
        </View>
      </View>
      <View style={styles.orderItemBody}>
        <View style={styles.orderItemsList}>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemsText}>
              {orderItem.name}....{orderItem.price} X{orderItem.qty}
            </Text>
          ))}
        </View>
        <Text style={styles.instructions}>{item.specialInstructions}</Text>
      </View>
      <View style={styles.orderStatus}>
        {[1, 2, 3, 4].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => updateOrderStatus(item.id, status)}
            style={[
              styles.status,
              item.status === status && {
                backgroundColor: getStatusColor(status),
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === status && {
                  color: "whitesmoke",
                  fontSize: 15,
                },
              ]}
            >
              {status === 1
                ? "Placed"
                : status === 2
                ? "Accepted"
                : status === 3
                ? "Preparing"
                : "Delivered"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTemp}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
          <Text style={styles.title}>Orders</Text>
        </View>
        <Pressable onPress={handlePushCall}>
          <AntDesign name="bells" size={24} color="green" />
        </Pressable>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderContainer}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  orderContainer: {
    marginVertical: "5%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    justifyContent: "space-between",
  },
  headerTemp: { flexDirection: "row", alignItems: "center" },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  orderItem: {
    backgroundColor: "#333",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  orderItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemsList: {
    gap: 5,
    // marginVertical: 5,
    marginVertical: "auto",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "goldenrod",
    marginBottom: 5,
  },
  tableNo: { color: "white" },
  orderItemBody: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: "3%",
  },
  instructions: {
    margin: "auto",
    color: "peachpuff",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "400",
    flexWrap: "wrap",
  },
  orderStatus: {
    flexDirection: "row",
    marginTop: "5%",
    justifyContent: "space-between",
  },
  orderPrice: {
    marginTop: "auto",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  status: {
    borderWidth: 1,
    borderColor: "whitesmoke",
    padding: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    color: "white",
    fontSize: 12,
  },
  itemsText: {
    color: "white",
  },
  totalText: {
    color: "white",
    fontWeight: "bold",
    // marginTop: "auto",
  },
});
