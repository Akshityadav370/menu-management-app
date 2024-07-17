import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, db, deleteDoc } from "@/firebase/index";

// Menu List -> Menu Items[]
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

const MenuItem = (props) => {
  // State variables for updating functionality
  const [isActive, setIsActive] = useState(props.status);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.desc);
  const [modalVisible, setModalVisible] = useState(false);

  // To update the status of the menu card
  const updateIsActive = async () => {
    const menuRef = doc(db, "menu", props.id);
    await updateDoc(menuRef, {
      status: isActive
    });
    // Given this to re-render active/inactive items on dashboard
    props.getMenuList();
  };

  // To delete the menu item
  const deleteMenuItem = async () => {
    try {
      const menuRef = doc(db, "menu", props.id);
      await deleteDoc(menuRef);
      props.getMenuList(); // Refresh menu list after deletion
    } catch (error) {
      console.error("Error deleting menu item: ", error);
    }
  };

  // Confirmation Dialog Box Before deleting
  const confirmDelete = () => {
    Alert.alert(
      `${props.title}`,
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteMenuItem,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // To update the menu item i.e. title, desc, status
  const updateMenuItem = async () => {
    const menuRef = doc(db, "menu", props.id);

    await updateDoc(menuRef, {
      title: title,
      description: description,
      status: true
    });
    setModalVisible(false);
    props.getMenuList();
  };

  // To render the cards with updated status data when we toggle the status
  useEffect(() => {
    updateIsActive();
  }, [isActive]);

  return (
    <View
      style={[styles.container, isActive ? { opacity: 1 } : { opacity: 0.7 }]}
    >
      {/* Close Button */}
      <Pressable onPress={confirmDelete}>
        <AntDesign name="closecircleo" size={24} color="lightcoral" />
      </Pressable>
      {/* Information about the dish */}
      <View style={styles.content}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.desc}</Text>
      </View>
      {/* Card Options: Edit & Delete */}
      <View style={styles.options}>
        <Pressable onPress={() => setModalVisible(true)}>
          <AntDesign name="edit" size={24} color="floralwhite" />
        </Pressable>
        <Pressable
          onPress={() => setIsActive((previousState) => !previousState)}
          style={[styles.switch, isActive ? styles.active : styles.inactive]}
        >
          <Text style={styles.switchText}>
            {isActive ? "Active" : "Inactive"}
          </Text>
        </Pressable>
      </View>

      {/* Update Modal */}
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
            <Text style={styles.modalTitle}>Update Menu Item</Text>
            <TextInput
              placeholder="Title"
              style={styles.modalInput}
              value={title}
              onChangeText={(text) => setTitle(text)}
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
                value={isActive}
                onValueChange={(value) => setIsActive(value)}
              />
            </View>
            {/* Buttons (confirm & cancel) */}
            <Pressable
              style={[styles.button, styles.buttonAdd]}
              onPress={updateMenuItem}
            >
              <Text style={styles.textStyle}>Update Item</Text>
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
    </View>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "dimgrey",
    marginVertical: 10,
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
    color: "gold",
  },
  description: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "italic",
    color: "lemonchiffon",
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switch: {
    marginLeft: 10,
    width: 80,
    padding: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "mediumseagreen",
  },
  inactive: {
    backgroundColor: "gray",
  },
  switchText: {
    color: "white",
    fontWeight: "bold",
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

