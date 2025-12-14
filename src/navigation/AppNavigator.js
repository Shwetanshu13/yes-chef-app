import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import RecipeListScreen from '../screens/RecipeListScreen';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import { colors } from '../theme/colors';

enableScreens();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: colors.background },
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                {user ? (
                    <Stack.Group>
                        <Stack.Screen name="Recipes" component={RecipeListScreen} options={{ title: 'Yes Chef' }} />
                        <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} options={{ title: 'Create Recipe' }} />
                        <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Connections' }} />
                        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome' }} />
                        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create account' }} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
});
