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
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function OrdersScreen() {
  const router = useRouter();

  const orders1 = [
    {
      id: 1,
      tableNo: 2,
      total: "21",
      status: 2,
      items: [
        { name: "Item 1", qty: 2, price: "10" },
        { name: "Item 2", qty: 1, price: "2" },
        { name: "Item 3", qty: 2, price: "6" },
      ],
    },
    {
      id: 2,
      tableNo: 3,
      total: "25",
      status: 3,
      items: [
        { name: "Item 3", qty: 2, price: "10" },
        { name: "Item 1", qty: 1, price: "2" },
        { name: "Item 4", qty: 2, price: "6" },
      ],
    },
    {
      id: 3,
      tableNo: 4,
      total: "30",
      status: 1,
      items: [
        { name: "Item 5", qty: 1, price: "10" },
        { name: "Item 2", qty: 2, price: "5" },
        { name: "Item 1", qty: 3, price: "15" },
      ],
    },
    {
      id: 4,
      tableNo: 1,
      total: "18",
      status: 2,
      items: [
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 3", qty: 1, price: "6" },
        { name: "Item 4", qty: 1, price: "8" },
      ],
    },
    {
      id: 5,
      tableNo: 5,
      total: "40",
      status: 1,
      items: [
        { name: "Item 6", qty: 4, price: "10" },
        { name: "Item 1", qty: 2, price: "5" },
        { name: "Item 5", qty: 1, price: "5" },
      ],
    },
    {
      id: 6,
      tableNo: 6,
      total: "35",
      status: 3,
      items: [
        { name: "Item 3", qty: 3, price: "10" },
        { name: "Item 2", qty: 2, price: "10" },
        { name: "Item 4", qty: 1, price: "5" },
      ],
    },
    {
      id: 7,
      tableNo: 7,
      total: "22",
      status: 2,
      items: [
        { name: "Item 7", qty: 1, price: "12" },
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 3", qty: 1, price: "6" },
      ],
    },
    {
      id: 8,
      tableNo: 8,
      total: "27",
      status: 1,
      items: [
        { name: "Item 4", qty: 3, price: "18" },
        { name: "Item 5", qty: 1, price: "5" },
        { name: "Item 1", qty: 2, price: "4" },
      ],
    },
    {
      id: 9,
      tableNo: 9,
      total: "16",
      status: 2,
      items: [
        { name: "Item 2", qty: 2, price: "4" },
        { name: "Item 6", qty: 1, price: "10" },
        { name: "Item 7", qty: 1, price: "2" },
      ],
    },
    {
      id: 10,
      tableNo: 10,
      total: "50",
      status: 3,
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

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderItemHeader}>
        <Text style={styles.customerName}>
          Table <Text style={styles.tableNo}>{item.tableNo}</Text>
        </Text>
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
      <View style={styles.orderItemBody}>
        <View style={styles.orderItemsList}>
          {item.items.map((orderItem, index) => (
            <Text key={index} style={styles.itemsText}>
              {orderItem.name}....{orderItem.price} X{orderItem.qty}
            </Text>
          ))}
        </View>
        <View style={styles.orderPrice}>
          <Text style={styles.totalText}>₹{item.total}</Text>
          <AntDesign name="delete" size={24} color={"goldenrod"} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>Orders</Text>
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
  },
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
    justifyContent: "space-between",
    marginTop: "3%",
  },
  orderStatus: {
    flexDirection: "row",
    // marginTop: "auto",
    marginVertical: "auto",
    gap: 7,
  },
  orderPrice: {
    marginTop: "auto",
    flexDirection: "row",
    gap: 10,
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
