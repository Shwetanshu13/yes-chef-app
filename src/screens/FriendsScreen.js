import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { listFriends, addFriend } from '../services/friendService';
import { useAuth } from '../context/AuthContext';
import { AppTabs } from '../components/AppTabs';

export default function FriendsScreen() {
    const { token } = useAuth();
    const [friends, setFriends] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const data = await listFriends(token);
            setFriends(data.friends || data || []);
        } catch (err) {
            Alert.alert('Could not load friends', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            setAdding(true);
            await addFriend({ token, email });
            setEmail('');
            load();
        } catch (err) {
            Alert.alert('Could not add friend', err.message);
        } finally {
            setAdding(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name || item.email}</Text>
            <Text style={styles.sub}>{item.email}</Text>
            <Text style={styles.meta}>{item.recipeCount || 0} recipes</Text>
        </View>
    );

    return (
        <View style={styles.page}>
            <ScreenWrapper>
                <Text style={styles.title}>Friends</Text>
                <Text style={styles.subtitle}>Connect to see each other's recipes.</Text>
                <Input label="Friend's email" value={email} onChangeText={setEmail} placeholder="friend@example.com" />
                <Button label={adding ? 'Adding…' : 'Send request'} onPress={handleAdd} disabled={adding} />
                <Text style={styles.section}>Your friends</Text>
                {loading ? <Text style={styles.loading}>Loading…</Text> : null}
                <FlatList data={friends} renderItem={renderItem} keyExtractor={(item, idx) => item.id || item._id || idx.toString()} />
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
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
    },
    subtitle: {
        color: colors.subtleText,
        marginTop: 6,
        marginBottom: 14,
    },
    section: {
        marginTop: 18,
        fontWeight: '700',
        color: colors.text,
    },
    loading: {
        marginTop: 10,
        color: colors.subtleText,
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        color: colors.text,
    },
    sub: {
        color: colors.subtleText,
        marginTop: 4,
    },
    meta: {
        marginTop: 6,
        color: colors.text,
        fontWeight: '700',
    },
});
