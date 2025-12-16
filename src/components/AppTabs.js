import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const tabs = [
    { label: 'Recipes', route: 'Recipes' },
    { label: 'Create', route: 'CreateRecipe' },
    { label: 'Friends', route: 'Friends' },
];

export function AppTabs() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const padBottom = Math.max(insets.bottom, 12);

    return (
        <View style={[styles.container, { paddingBottom: padBottom }]}>
            {tabs.map((tab) => {
                const isActive = route.name === tab.route;
                return (
                    <Pressable
                        key={tab.route}
                        onPress={() => navigation.navigate(tab.route)}
                        style={[styles.tab, isActive ? styles.active : null]}
                        accessibilityRole="button"
                    >
                        <Text style={[styles.label, isActive ? styles.activeLabel : null]}>{tab.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        paddingVertical: 10,
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -6 },
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 6,
    },
    active: {
        backgroundColor: colors.primary,
        elevation: 3,
    },
    label: {
        color: colors.text,
        fontWeight: '700',
    },
    activeLabel: {
        color: '#fff',
    },
});
