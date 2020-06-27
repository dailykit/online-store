import React from 'react';
import { View, Text } from 'react-native';
import { width } from '../../utils/Scalaing';
import { useAppContext } from '../../context/app';

const CardSkeleton = () => {
  const { visual } = useAppContext();

  return (
    <View
      style={{
        height: 370,
        width: width >= 1280 ? width * 0.2 : width,
        padding: 5,
        elevation: 2,
        shadowColor: '#666',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        backgroundColor: '#fff',
        marginBottom: 10,
        marginRight: width > 1280 ? 20 : 0,
        marginTop: width > 1280 ? 20 : 0,
        borderRadius: 4,
        opacity: 0.7,
      }}
    >
      <View
        style={{
          height: 150,
          width: '80%',
          marginHorizontal: 'auto',
          marginVertical: 10,
          backgroundColor: '#eaeded',
          borderRadius: 4,
        }}
      ></View>
      <View
        style={{
          height: 40,
          width: '80%',
          marginHorizontal: 'auto',
          marginBottom: 20,
          backgroundColor: '#eaeded',
          opacity: 0.5,
          borderRadius: 2,
        }}
      ></View>
      <View
        style={{
          height: 24,
          width: '80%',
          marginHorizontal: 'auto',
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            height: 24,
            width: 60,
            backgroundColor: '#eaeded',
            borderRadius: 2,
          }}
        ></View>
        <View
          style={{
            height: 24,
            width: 60,
            backgroundColor: '#eaeded',
            borderRadius: 2,
          }}
        ></View>
      </View>
      <View
        style={{
          height: 40,
          width: '80%',
          marginHorizontal: 'auto',
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            height: 24,
            width: 60,
            backgroundColor: '#eaeded',
            borderRadius: 2,
          }}
        ></View>
        <View
          style={{
            height: 30,
            width: 60,
            backgroundColor: visual.color,
            borderRadius: 2,
          }}
        ></View>
      </View>
    </View>
  );
};

export default CardSkeleton;
