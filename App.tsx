import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const BarcodeScanner: React.FC = () => {
  const [firstBarcode, setFirstBarcode] = useState<string>('');
  const [secondBarcode, setSecondBarcode] = useState<string>('');
  const [secondBarcodePrev, setSecondBarcodePrev] = useState<string>('');
  const [status, setStatus] = useState<string>('SCAN THE BARCODE');
  const [statusColor, setStatusColor] = useState<string>('black');

  function truncateLastTwo(input: number | string): number | string {
    if (typeof input === 'number') {
      let inputString = input.toString();
      return inputString.slice(0, -2);
    } else if (typeof input === 'string') {
      return input.slice(0, -2);
    } else {
      return 'Input must be a number or a string';
    }
  }

  const handleBarcodeScan = ({data}: {data: string}) => {
    if (!firstBarcode) {
      if (data === secondBarcodePrev) {
        console.log('same Scan', secondBarcodePrev, data);
        setStatus('Same as previous barcode, please change the code!');
         setStatusColor('blue');
      } else {
        console.log('first Scan');
        setFirstBarcode(data);
        if (firstBarcode === data) {
          setStatus(
            'Barcode is same as first barcode, place the second barcode to scan',
          );
        } else {
          setStatus('Scan the second barcode');
           setStatusColor('grey');
        }
      }
    } else if (firstBarcode && !secondBarcode && data !== firstBarcode) {
      console.log('second Scan');
      if (firstBarcode === data) {
        setStatus(
          'Barcode is same as first barcode, place the second barcode to scan',
        );
         setStatusColor('blue');
      } else {
        setSecondBarcode(data);
        setSecondBarcodePrev(data);
        checkMatch(data);
      }
    } else {
      setStatus(
        'Barcode is same as first barcode, place the second barcode to scan',
      );
       setStatusColor('blue');
    }
  };

  const checkMatch = (data: string) => {
    console.log(data, 'seoncd value');
    console.log(firstBarcode, 'first value');
    if (
      data.length === firstBarcode.length + 2 &&
      truncateLastTwo(data) === firstBarcode
    ) {
      setStatus(
        'Matched - First Barcode is ' +
          firstBarcode +
          ' & Second barcode is ' +
          data,
      );
      setStatusColor('green');
      console.log('cycle reset');
      setFirstBarcode('');
      setSecondBarcode('');
    } else {
      setStatus('Not matched - First Barcode is ' + firstBarcode + " & Second barcode is " + data);
       setStatusColor('red');
      console.log('cycle reset');
      setFirstBarcode('');
      setSecondBarcode('');
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleBarcodeScan}
        cameraStyle={styles.cameraContainer}
        reactivate={true}
        reactivateTimeout={3000}
        showMarker={true}
      />
      <View
        style={{
          paddingVertical: 100,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: statusColor,
        }}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {},
  statusText: {
    color: 'white',
    fontSize: 25,
  },
});

export default BarcodeScanner;
