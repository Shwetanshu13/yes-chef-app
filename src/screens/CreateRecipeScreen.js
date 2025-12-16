import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { TagChip } from '../components/TagChip';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../services/recipeService';
import { generateRecipeFromPrompt, structureRecipeFromText } from '../services/aiService';
import { AppTabs } from '../components/AppTabs';

const typeOptions = [
    { label: 'Veg', value: 'veg' },
    { label: 'Non-Veg', value: 'non_veg' },
    { label: 'Vegan', value: 'vegan' },
];

const cuisineOptions = [
    'continental',
    'north_indian',
    'south_indian',
    'english',
    'american',
    'chinese',
    'japanese',
    'mediterranean',
    'mexican',
    'thai',
];

const courseOptions = [
    'starter',
    'appetizer',
    'main_course',
    'beverage',
    'dessert',
    'snack',
];

function RecipePreview({ data }) {
    if (!data) return null;
    const nutritionEntries =
        data.nutrition && typeof data.nutrition === 'object'
            ? Object.entries(data.nutrition)
            : [];
    return (
        <View style={styles.preview}>
            <Text style={styles.previewTitle}>{data.title}</Text>
            <Text style={styles.previewSubtitle}>{data.description}</Text>
            <View style={styles.metaRow}>
                {data.type ? <Text style={styles.meta}>{data.type}</Text> : null}
                {data.cuisine ? <Text style={styles.meta}>{data.cuisine}</Text> : null}
                {data.course ? <Text style={styles.meta}>{data.course}</Text> : null}
            </View>
            <Text style={styles.previewLabel}>Ingredients</Text>
            {data.ingredients?.map((item, idx) => (
                <Text key={idx} style={styles.previewItem}>• {item}</Text>
            ))}
            <Text style={styles.previewLabel}>Steps</Text>
            {data.steps?.map((item, idx) => (
                <Text key={idx} style={styles.previewItem}>{idx + 1}. {item}</Text>
            ))}
            {nutritionEntries.length ? (
                <View style={{ marginTop: 8 }}>
                    <Text style={styles.previewLabel}>Nutrition</Text>
                    {nutritionEntries.map(([k, v]) => (
                        <Text key={k} style={styles.previewItem}>• {k}: {v}</Text>
                    ))}
                </View>
            ) : null}
        </View>
    );
}

export default function CreateRecipeScreen() {
    const { token } = useAuth();
    const [mode, setMode] = useState('manual');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [type, setType] = useState(typeOptions[0].value);
    const [cuisine, setCuisine] = useState(cuisineOptions[0]);
    const [course, setCourse] = useState(courseOptions[2]);
    const [image, setImage] = useState('');
    const [link, setLink] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [rawText, setRawText] = useState('');
    const [prompt, setPrompt] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [working, setWorking] = useState(false);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setType(typeOptions[0].value);
        setCuisine(cuisineOptions[0]);
        setCourse(courseOptions[2]);
        setImage('');
        setLink('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        setRawText('');
        setPrompt('');
        setAiResult(null);
    };

    const nutritionPayload = useMemo(() => {
        const n = {};
        if (calories) n.calories = Number(calories);
        if (protein) n.protein = Number(protein);
        if (carbs) n.carbs = Number(carbs);
        if (fat) n.fat = Number(fat);
        return Object.keys(n).length ? n : undefined;
    }, [calories, protein, carbs, fat]);

    const normalizeRecipe = (data) => {
        if (!data) return null;
        return {
            title: data.title || title,
            description: data.description || '',
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            steps: Array.isArray(data.steps) ? data.steps : [],
            cuisine: data.cuisine || cuisine,
            type: data.type || type,
            course: data.course || course,
            nutrition: data.nutrition || nutritionPayload || {},
            image: data.image || '',
            link: data.link || '',
        };
    };

    const handleManualSave = async () => {
        try {
            setWorking(true);
            const recipe = {
                title,
                description,
                ingredients: ingredients.split('\n').map((i) => i.trim()).filter(Boolean),
                steps: steps.split('\n').map((s) => s.trim()).filter(Boolean),
                cuisine,
                type,
                course,
                nutrition: nutritionPayload,
                image: image.trim(),
                link: link.trim(),
            };
            await createRecipe({ token, recipe });
            Alert.alert('Saved', 'Recipe saved successfully');
            resetForm();
        } catch (err) {
            Alert.alert('Could not save', err.message);
        } finally {
            setWorking(false);
        }
    };

    const handleStructure = async () => {
        try {
            setWorking(true);
            const data = await structureRecipeFromText(rawText);
            setAiResult(normalizeRecipe(data));
        } catch (err) {
            Alert.alert('AI failed', err.message);
        } finally {
            setWorking(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setWorking(true);
            const data = await generateRecipeFromPrompt(prompt);
            setAiResult(normalizeRecipe(data));
        } catch (err) {
            Alert.alert('AI failed', err.message);
        } finally {
            setWorking(false);
        }
    };

    const saveAiRecipe = async () => {
        try {
            if (!aiResult) return;
            setWorking(true);
            await createRecipe({ token, recipe: normalizeRecipe(aiResult) });
            Alert.alert('Saved', 'Recipe saved successfully');
            resetForm();
        } catch (err) {
            Alert.alert('Could not save', err.message);
        } finally {
            setWorking(false);
        }
    };

    return (
        <View style={styles.page}>
            <ScreenWrapper scrollable ScrollComponent={ScrollView}>
                <Text style={styles.heading}>Create recipe</Text>
                <View style={styles.modeRow}>
                    <TagChip label="Manual" active={mode === 'manual'} onPress={() => setMode('manual')} />
                    <TagChip label="Semi AI" active={mode === 'semi'} onPress={() => setMode('semi')} />
                    <TagChip label="Full AI" active={mode === 'full'} onPress={() => setMode('full')} />
                </View>

                {mode === 'manual' && (
                    <View>
                        <Input label="Title" value={title} onChangeText={setTitle} placeholder="Cozy tomato pasta" />
                        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Quick weekday dinner" multiline />
                        <Input label="Ingredients" value={ingredients} onChangeText={setIngredients} placeholder="One per line" multiline />
                        <Input label="Steps" value={steps} onChangeText={setSteps} placeholder="One step per line" multiline />
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.tagsRow}>
                            {typeOptions.map((opt) => (
                                <TagChip key={opt.value} label={opt.label} active={type === opt.value} onPress={() => setType(opt.value)} />
                            ))}
                        </View>

                        <Text style={styles.label}>Cuisine</Text>
                        <View style={styles.tagsRow}>
                            {cuisineOptions.map((c) => (
                                <TagChip key={c} label={c.replace(/_/g, ' ')} active={cuisine === c} onPress={() => setCuisine(c)} />
                            ))}
                        </View>

                        <Text style={styles.label}>Course</Text>
                        <View style={styles.tagsRow}>
                            {courseOptions.map((c) => (
                                <TagChip key={c} label={c.replace(/_/g, ' ')} active={course === c} onPress={() => setCourse(c)} />
                            ))}
                        </View>

                        <Input label="Image URL" value={image} onChangeText={setImage} placeholder="https://..." />
                        <Input label="Reference link (optional)" value={link} onChangeText={setLink} placeholder="https://..." />

                        <Text style={styles.label}>Nutrition (optional)</Text>
                        <View style={styles.row}>
                            <View style={styles.quarter}><Input label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" /></View>
                            <View style={styles.quarter}><Input label="Protein" value={protein} onChangeText={setProtein} keyboardType="numeric" /></View>
                            <View style={styles.quarter}><Input label="Carbs" value={carbs} onChangeText={setCarbs} keyboardType="numeric" /></View>
                            <View style={styles.quarter}><Input label="Fat" value={fat} onChangeText={setFat} keyboardType="numeric" /></View>
                        </View>
                        <Button label={working ? 'Saving…' : 'Save recipe'} onPress={handleManualSave} disabled={working} />
                    </View>
                )}

                {mode === 'semi' && (
                    <View>
                        <Input
                            label="Paste your unformatted recipe"
                            value={rawText}
                            onChangeText={setRawText}
                            placeholder="Copy any recipe text here"
                            multiline
                        />
                        <Button label={working ? 'Thinking…' : 'Structure with AI'} onPress={handleStructure} disabled={working} />
                        <RecipePreview data={aiResult} />
                        {aiResult ? <Button label={working ? 'Saving…' : 'Save recipe'} onPress={saveAiRecipe} disabled={working} /> : null}
                    </View>
                )}

                {mode === 'full' && (
                    <View>
                        <Input
                            label="Describe the dish"
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="A cozy fall soup with pumpkin and sage"
                            multiline
                        />
                        <Button label={working ? 'Creating…' : 'Generate with AI'} onPress={handleGenerate} disabled={working} />
                        <RecipePreview data={aiResult} />
                        {aiResult ? <Button label={working ? 'Saving…' : 'Save recipe'} onPress={saveAiRecipe} disabled={working} /> : null}
                    </View>
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
    heading: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    modeRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    half: {
        flex: 1,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    meta: {
        backgroundColor: '#eef2ef',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        fontWeight: '700',
        color: colors.text,
    },
    label: {
        color: colors.subtleText,
        marginBottom: 8,
        fontWeight: '700',
    },
    preview: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        borderWidth: 1,
        borderColor: colors.border,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
    },
    previewSubtitle: {
        color: colors.subtleText,
        marginTop: 4,
        marginBottom: 8,
    },
    previewLabel: {
        marginTop: 8,
        fontWeight: '700',
        color: colors.text,
    },
    previewItem: {
        color: colors.text,
        marginTop: 4,
    },
    quarter: {
        flex: 1,
    },
});
