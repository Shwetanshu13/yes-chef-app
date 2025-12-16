import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export function ScreenWrapper({ children, scrollable, ScrollComponent }) {
    if (scrollable && ScrollComponent) {
        const Scroll = ScrollComponent;
        return (
            <SafeAreaView style={styles.safe}>
                <Scroll style={styles.scroll} contentContainerStyle={styles.container}>
                    <Scroll style={styles.inner}>
                        {children}
                    </Scroll>
                </Scroll>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 0,
    },
    scroll: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 40,
        maxWidth: 920,
        alignSelf: 'center',
    },
    inner: {
        paddingBottom: 30,
    },
});
