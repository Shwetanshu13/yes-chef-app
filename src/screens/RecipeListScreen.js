import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Input } from '../components/Input';
import { RecipeCard } from '../components/RecipeCard';
import { TagChip } from '../components/TagChip';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { listRecipes } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';
import { AppTabs } from '../components/AppTabs';

const tagOptions = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Quick'];
export default function RecipeListScreen() {
    const navigation = useNavigation();
    const { token, user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeTags, setActiveTags] = useState([]);
    const isFocused = useIsFocused();

    const toggleTag = (tag) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listRecipes({ token, search, filters: activeTags });
            const incoming = Array.isArray(data?.recipes)
                ? data.recipes
                : Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data)
                        ? data
                        : [];
            setRecipes(incoming);
        } catch (err) {
            Alert.alert('Could not load recipes', err.message);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTags]);

    const filtered = useMemo(() => {
        const source = Array.isArray(recipes) ? recipes : [];
        if (!search) return source;
        return source.filter((r) =>
            r.title?.toLowerCase().includes(search.toLowerCase()) ||
            r.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [recipes, search]);

    return (
        <View style={styles.page}>
            <ScreenWrapper scrollable ScrollComponent={ScrollView}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.welcome}>Hi {user?.name || 'chef'},</Text>
                        <Text style={styles.title}>Your recipes</Text>
                    </View>
                    <Button label="New" onPress={() => navigation.navigate('CreateRecipe')} variant="secondary" />
                </View>

                <Input
                    label="Search"
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Type a dish, ingredient, or mood"
                />

                <Text style={styles.sectionLabel}>Filters</Text>
                <View style={styles.tagsRow}>
                    {tagOptions.map((tag) => (
                        <TagChip key={tag} label={tag} active={activeTags.includes(tag)} onPress={() => toggleTag(tag)} />
                    ))}
                </View>

                {loading ? (
                    <Text style={styles.loading}>Loading…</Text>
                ) : filtered.length === 0 ? (
                    <EmptyState title="No recipes yet" subtitle="Create one or ask AI to craft something tasty." />
                ) : (
                    filtered.map((recipe) => (
                        <RecipeCard
                            key={recipe.id || recipe._id || recipe.title}
                            recipe={recipe}
                            onPress={() => navigation.navigate('RecipeDetail', { recipe })}
                        />
                    ))
                )}
            </ScreenWrapper>
            <AppTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    welcome: {
        color: colors.subtleText,
        fontSize: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
    },
    sectionLabel: {
        color: colors.subtleText,
        marginTop: 12,
        marginBottom: 6,
        fontWeight: '700',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    loading: {
        marginTop: 20,
        color: colors.subtleText,
    },
});
