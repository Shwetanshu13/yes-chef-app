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
                    {children}
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
    },
    scroll: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 30,
    },
});
