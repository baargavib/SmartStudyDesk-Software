import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Linking, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { fetchAIRecommendations } from '../services/aiService';

const standardResources = [
    { id: '1', title: 'Data Structures - Binary Trees', type: 'video', url: 'https://youtube.com' },
    { id: '2', title: 'CS101 Term Paper Guidelines', type: 'document', url: 'https://wikipedia.org' },
    { id: '3', title: 'Calculus III Study Guide', type: 'document', url: 'https://mathworld.wolfram.com' },
    { id: '4', title: 'Intro to React Native', type: 'video', url: 'https://reactnative.dev' },
];

export default function ResourcesScreen() {
    const { isLargeText, t, theme, language } = useContext(AppContext);
    
    const [aiRecs, setAiRecs] = useState(null);
    const [isLoadingAI, setIsLoadingAI] = useState(true);

    useEffect(() => {
        const loadRecommendations = async () => {
            const recs = await fetchAIRecommendations();
            setAiRecs(recs);
            setIsLoadingAI(false);
        };
        loadRecommendations();
    }, []);

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openLink(item.url)} activeOpacity={0.7} style={styles.flashcardWrapper}>
            <Card style={[styles.resourceCard, { backgroundColor: theme.colors.card, borderTopColor: item.type === 'video' ? theme.colors.primary : theme.colors.secondary }]}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={item.type === 'video' ? 'play-circle' : 'document-text'}
                        size={36}
                        color={item.type === 'video' ? theme.colors.primary : theme.colors.secondary}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.titleText, { color: theme.colors.text }, isLargeText && styles.largeText]} numberOfLines={3}>
                        {item.title}
                    </Text>
                </View>
                <View style={styles.footerRow}>
                    <Text style={[styles.urlText, { color: theme.colors.subText }]} numberOfLines={1}>{item.type === 'video' ? (t.watchVideo || 'Watch Video') : (t.readDoc || 'Read Doc')}</Text>
                    <Ionicons name="open-outline" size={16} color={theme.colors.subText} />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* AI Recommendation Engine Header */}
            <View style={styles.aiHeaderContainer}>
                <View style={styles.aiTitleRow}>
                    <Text style={[styles.aiTitle, { color: theme.colors.text }, isLargeText && {fontSize: 28}]}>{t.aiSelected || '🤖 AI Selected For You'}</Text>
                    {isLoadingAI && <ActivityIndicator color={theme.colors.primary} />}
                </View>
                
                {aiRecs && !isLoadingAI && (
                    <Text style={[styles.aiRationale, { color: theme.colors.subText }]}>{aiRecs.rationale}</Text>
                )}
            </View>

            {/* AI Recommendation Slider */}
            {aiRecs && !isLoadingAI && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.aiSlider} contentContainerStyle={styles.aiSliderContent}>
                    {aiRecs.items.map(item => (
                        <TouchableOpacity key={item.id} onPress={() => openLink(item.url)} activeOpacity={0.9}>
                            <View style={[styles.aiCard, { backgroundColor: item.color }]}>
                                <View style={styles.aiCardHeader}>
                                    <Ionicons name={item.type === 'video' ? 'videocam' : 'book'} size={24} color="#FFF" />
                                    <Text style={styles.aiTag}>{t.highMatch || 'HIGH MATCH'}</Text>
                                </View>
                                <Text style={[styles.aiCardTitle, isLargeText && {fontSize: 24}]} numberOfLines={3}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Standard Vault Grid */}
            <View style={styles.vaultHeader}>
                 <Text style={[styles.vaultTitle, { color: theme.colors.text }, isLargeText && {fontSize: 24}]}>{t.knowledgeVault || 'Knowledge Vault'}</Text>
                 <Text style={[styles.vaultSubtitle, { color: theme.colors.subText }]}>{t.vaultSubtitle}</Text>
            </View>

            <View style={{ paddingHorizontal: 12 }}>
                <FlatList
                    data={standardResources}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    scrollEnabled={false} // Since wrapped in ScrollView
                    columnWrapperStyle={styles.row}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    aiHeaderContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    aiTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    aiTitle: {
        fontSize: 24,
        fontWeight: '900',
    },
    aiRationale: {
        fontSize: 15,
        fontWeight: '500',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    aiSlider: {
        marginBottom: 30,
    },
    aiSliderContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    aiCard: {
        width: 280,
        height: 180,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    aiCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    aiTag: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    aiCardTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        lineHeight: 26,
    },
    vaultHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    vaultTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    vaultSubtitle: {
        fontSize: 14,
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    flashcardWrapper: {
        flex: 1,
        maxWidth: '48%',
    },
    resourceCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 16,
        padding: 16,
        borderTopWidth: 4, 
        minHeight: 160,
    },
    iconContainer: {
        marginBottom: 12,
    },
    textContainer: {
        flex: 1,
        marginBottom: 8,
        width: '100%',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 22,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 'auto',
    },
    urlText: {
        fontSize: 12,
        flex: 1,
        marginRight: 4,
    },
    largeText: {
        fontSize: 22,
        lineHeight: 28,
    }
});
