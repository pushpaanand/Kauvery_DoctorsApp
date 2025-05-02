import React, { useRef } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Portal, Title } from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';

export default function SignatureModal({ visible, onClose, onSave }) {
  const signatureRef = useRef();

  const handleSignature = (signature) => {
    onSave(signature);
    onClose();
  };

  const handleClear = () => {
    signatureRef.current.clearSignature();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose}>
        <View style={styles.container}>
          <Title style={styles.title}>Digital Signature</Title>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            webStyle={`.m-signature-pad--footer {display: none}`}
            backgroundColor="white"
          />
          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={handleClear}>
              Clear
            </Button>
            <Button mode="contained" onPress={() => signatureRef.current.readSignature()}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    height: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
}); 