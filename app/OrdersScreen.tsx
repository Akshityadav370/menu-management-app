import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function OrdersScreen() {
  const router = useRouter();

  const orders1 = [
    {
      id: 1,
      tableNo: 2,
      status: 2,
      specialInstructions: "No onions in any dish",
      items: [
        { name: "Item 1", qty: 2, price: "10" },
        { name: "Item 2", qty: 1, price: "2" },
        { name: "Item 3", qty: 2, price: "6" },
      ],
    },
    {
      id: 2,
      tableNo: 3,
      status: 3,
      specialInstructions: "Extra spicy for all items",
      items: [
        { name: "Item 3", qty: 2, price: "10" },
        { name: "Item 1", qty: 1, price: "2" },
        { name: "Item 4", qty: 2, price: "6" },
      ],
    },
    {
      id: 3,
      tableNo: 4,
      status: 1,
      specialInstructions: "Gluten-free options only",
      items: [
        { name: "Item 5", qty: 1, price: "10" },
        { name: "Item 2", qty: 2, price: "5" },
        { name: "Item 1", qty: 3, price: "15" },
      ],
    },
    {
      id: 4,
      tableNo: 1,
      status: 2,
      specialInstructions: "No added sugar",
      items: [
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 3", qty: 1, price: "6" },
        { name: "Item 4", qty: 1, price: "8" },
      ],
    },
    {
      id: 5,
      tableNo: 5,
      status: 1,
      specialInstructions: "Vegetarian options only",
      items: [
        { name: "Item 6", qty: 4, price: "10" },
        { name: "Item 1", qty: 2, price: "5" },
        { name: "Item 5", qty: 1, price: "5" },
      ],
    },
    {
      id: 6,
      tableNo: 6,
      status: 3,
      specialInstructions: "No cilantro",
      items: [
        { name: "Item 3", qty: 3, price: "10" },
        { name: "Item 2", qty: 2, price: "10" },
        { name: "Item 4", qty: 1, price: "5" },
      ],
    },
    {
      id: 7,
      tableNo: 7,
      status: 2,
      specialInstructions: "No nuts",
      items: [
        { name: "Item 7", qty: 1, price: "12" },
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 3", qty: 1, price: "6" },
      ],
    },
    {
      id: 8,
      tableNo: 8,
      status: 1,
      specialInstructions: "Extra crispy for all fried items",
      items: [
        { name: "Item 4", qty: 3, price: "18" },
        { name: "Item 5", qty: 1, price: "5" },
        { name: "Item 1", qty: 2, price: "4" },
      ],
    },
    {
      id: 9,
      tableNo: 9,
      status: 2,
      specialInstructions: "Add lemon slices",
      items: [
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 6", qty: 1, price: "10" },
        { name: "Item 7", qty: 1, price: "2" },
      ],
    },
    {
      id: 10,
      tableNo: 10,
      status: 3,
      specialInstructions: "No dairy products",
      items: [
        { name: "Item 8", qty: 5, price: "20" },
        { name: "Item 3", qty: 2, price: "10" },
        { name: "Item 1", qty: 3, price: "20" },
      ],
    },
  ];

  const [orders, setOrders] = useState(orders1);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
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

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemHeader}>
        <Text style={styles.customerName}>
          Table <Text style={styles.tableNo}>{item.tableNo}</Text>
        </Text>
        <View style={styles.orderPrice}>
          <AntDesign name="delete" size={24} color={"tomato"} />
          {/* <Pressable onPress={handlePushCall}>
            <FontAwesome name="edit" size={24} color={"goldenrod"} />
          </Pressable> */}
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
