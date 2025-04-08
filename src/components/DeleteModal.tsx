import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import CustomButton from "./CustomButton";

interface DeleteModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  modalVisible,
  closeModal,
  handleDelete,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Are you sure you want to delete the data?
          </Text>
          <View
            style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <View style={{ width: 70, marginRight: 10 }}>
              <CustomButton onPress={closeModal} text="NO" type="SECONDARY" />
            </View>
            <View style={{ width: 70 }}>
              <CustomButton onPress={handleDelete} text="Yes" type="TERTIARY" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default DeleteModal;
