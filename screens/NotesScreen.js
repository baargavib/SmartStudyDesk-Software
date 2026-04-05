import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { supabase } from '../services/supabase';

export default function NotesScreen() {
    const { t, isLargeText, theme } = useContext(AppContext);
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            if (supabase.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
                throw new Error("Missing Key");
            }
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.log('Using mock notes due to Supabase error:', error.message);
            // Fallback mock data
            setNotes([
                { id: '1', content: 'Study Chapter 4: Binary Trees.', created_at: new Date().toISOString() },
                { id: '2', content: 'Don\'t forget to submit the math assignment.', created_at: new Date().toISOString() },
                { id: '3', content: 'Flashcard 3: React Hooks are awesome!', created_at: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return;

        const newNote = {
            content: noteContent,
            created_at: new Date().toISOString(),
        };

        try {
            if (supabase.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
                throw new Error("Missing Key");
            }
            const { data, error } = await supabase.from('notes').insert([newNote]).select();
            if (error) throw error;

            if (data) setNotes([data[0], ...notes]);
            setNoteContent('');
        } catch (error) {
            console.log('Mock insert due to Supabase error:', error.message);
            setNotes([{ id: Math.random().toString(), ...newNote }, ...notes]);
            setNoteContent('');
        }
    };

    const renderNote = ({ item }) => (
        <View style={styles.flashcardWrapper}>
            <Card style={[styles.flashcard, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.secondary }]}>
                <Text style={[styles.noteContent, { color: theme.colors.text }, isLargeText && styles.largeText]}>
                    {item.content}
                </Text>
                <Text style={[styles.noteDate, { color: theme.colors.subText }]}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </Card>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
                <TextInput
                    style={[
                        styles.input, 
                        isLargeText && styles.largeInput,
                        { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }
                    ]}
                    placeholder={t.typeNote || "Add a new flashcard..."}
                    placeholderTextColor={theme.colors.subText}
                    value={noteContent}
                    onChangeText={setNoteContent}
                    multiline
                />
                <Button

                    title={t.save || "Save"}
                    onPress={handleSaveNote}
                    type="primary"
                    isLargeText={isLargeText}
                />
            </View>

            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={notes}
                        renderItem={renderNote}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        numColumns={2} // Creates the grid of flashcards
                        columnWrapperStyle={styles.row}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        padding: 16,
        borderBottomWidth: 1,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        zIndex: 10,
    },
    input: {
        height: 100,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    largeInput: {
        fontSize: 22,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        padding: 8, // outer padding for grid
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    flashcardWrapper: {
        flex: 1,
        maxWidth: '48%', // ensuring 2 columns with spacing
    },
    flashcard: {
        flex: 1,
        padding: 16,
        minHeight: 140, // consistent height
        borderTopWidth: 4, // accent color strip
        marginVertical: 8, // override default margin
    },
    noteContent: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        flex: 1,
    },
    largeText: {
        fontSize: 22,
        lineHeight: 28,
    },
    noteDate: {
        fontSize: 12,
        marginTop: 8,
        alignSelf: 'flex-end',
    }
});
