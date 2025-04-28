import React from 'react'
import { Dimensions, Image, Platform, StyleSheet, View, Text } from 'react-native';
const { width, height } = Dimensions.get('window');
const SplashScreen = () => {
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentHeader}>We're under Development</Text>
                <Image source={require('../assets/images/unicodePad.png')} />
                <Text style={styles.subtitleText}>You might encounter occational glitches or limited functionality.Your patience adn feedback will help us improve!</Text>
            </View>
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>
                    Version 0.1
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? height * 0.06 : height * 0.13,
    },
    subtitleText: {
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        fontSize: 13,
        color: '#333',
        marginBottom: 10,
    },
    logoContainer: {
        height: height * 0.04,
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.25,
        resizeMode: 'contain',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentHeader: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B4236C',
        marginBottom: 5,
    },
    versionContainer: {
        alignItems: 'center'
    },
    versionText: {
        fontWeight: 'bold'
    }
});

export default SplashScreen
