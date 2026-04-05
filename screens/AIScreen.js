import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { chatWithAI, processOCRImage } from '../services/aiService';
import MarkdownText from '../components/MarkdownText';

export default function AIScreen() {
    const { t, isLargeText, theme, isLargeScreen, language } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);
    const hasInitialized = useRef(false);

    // Set greeting message on mount or language change
    React.useEffect(() => {
        if (!hasInitialized.current) {
            setMessages([{ id: 'start', text: t.aiGreeting, isAI: true }]);
            hasInitialized.current = true;
        }
    }, [language]);

    const appendMessage = (text, isAI, imageUri = null) => {
        setMessages(prev => [...prev, { id: Math.random().toString(), text, isAI, imageUri }]);
    };

    const handleSend = async () => {
        const query = inputText.trim();
        if (!query || isLoading) return;
        
        setInputText('');
        appendMessage(query, false);
        
        setIsLoading(true);
        const aiResponse = await chatWithAI(query);
        appendMessage(aiResponse, true);
        setIsLoading(false);
    };

    const pickImage = async (useCamera = false) => {
        try {
            const options = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage for expo-image-picker ^15.0.0
                quality: 0.2, // Drastically lower quality to reduce base64 size (prevent RN bridge crash)
                allowsEditing: true, // Force structural compression
                aspect: [4, 3], // Crop it to standardize size
                base64: true,
            };

            let result;
            if (useCamera) {
                const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert("Permission to access camera is required!");
                    return;
                }
                result = await ImagePicker.launchCameraAsync(options);
            } else {
                result = await ImagePicker.launchImageLibraryAsync(options);
            }

            if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
                const asset = result.assets[0];
                appendMessage("I've attached an image. Please generate Smart Notes from this document.", false, asset.uri);
                setIsLoading(true);

                const mimeType = asset.uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
                // Call Gemini OCR
                const response = await processOCRImage(asset.base64, mimeType);
                appendMessage(response, true);
                setIsLoading(false);
            }
        } catch (error) {
            Alert.alert("Error", "Could not process the image.");
            setIsLoading(false);
        }
    };

    const handleScanPress = () => {
        if (Platform.OS === 'web') {
             pickImage(false);
        } else {
            Alert.alert(
                t.scanDocument || "Scan Document",
                t.scanPrompt || "How would you like to provide your study notes?",
                [
                    { text: t.takePhoto || "Take Photo", onPress: () => pickImage(true) },
                    { text: t.chooseFromLibrary || "Choose from Library", onPress: () => pickImage(false) },
                    { text: t.cancel || "Cancel", style: "cancel" }
                ]
            );
        }
    };

    const renderMessage = ({ item }) => {
        return (
            <View style={[
                styles.messageBubble, 
                item.isAI ? { alignSelf: 'flex-start', backgroundColor: theme.colors.card, borderBottomLeftRadius: 4 } : { alignSelf: 'flex-end', backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 }
            ]}>
                {item.imageUri && (
                    <Image source={{ uri: item.imageUri }} style={{ width: 200, height: 260, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
                )}
                {item.isAI ? (
                    <MarkdownText
                        style={{ color: theme.colors.text }}
                        theme={theme}
                    >
                        {item.text}
                    </MarkdownText>
                ) : (
                    <Text style={[
                        styles.messageText, 
                        { color: '#FFF' }, 
                        isLargeText && styles.largeText
                    ]}>
                        {item.text}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={isLargeScreen ? 0 : 90}>
            <View style={[styles.contentWrapper, isLargeScreen && styles.contentWrapperLarge]}>
                
                {messages.length <= 1 && (
                    <View style={styles.heroHeader}>
                         <Text style={[styles.heroTitle, { color: theme.colors.text }, isLargeText && styles.largeText]}>{t.aiHeroTitle}</Text>
                         <Text style={[styles.heroSubtitle, { color: theme.colors.subText }]}>{t.aiHeroSubtitle}</Text>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                
                {/* Loader Indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={theme.colors.primary} size="small" />
                        <Text style={{color: theme.colors.subText, marginLeft: 8, fontStyle: 'italic'}}>{t.analyzing}</Text>
                    </View>
                )}

                <View style={styles.inputShadowWrapper}>
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={handleScanPress}>
                            <Ionicons name="camera" size={16} color={theme.colors.primary} />
                            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>{t.scanNotes || 'Scan Notes'}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => handleSend("Explain the concept of: ")}>
                            <Ionicons name="bulb" size={16} color={theme.colors.accent} />
                            <Text style={[styles.quickActionText, { color: theme.colors.text }]}>{t.explainConcept || 'Explain Concept'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text }, isLargeText && styles.largeInput]}
                            placeholder={t.askQuestion || "Describe what you need help with..."}
                            placeholderTextColor={theme.colors.subText}
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={() => handleSend()}
                            editable={!isLoading}
                        />
                        <TouchableOpacity 
                            style={[styles.sendBtn, { backgroundColor: isLoading ? theme.colors.border : theme.colors.primary }]} 
                            onPress={handleSend} 
                            disabled={isLoading}
                        >
                            <Ionicons name="send" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentWrapper: { flex: 1, width: '100%', alignSelf: 'center' },
    contentWrapperLarge: { maxWidth: 800 },
    heroHeader: { marginTop: 60, marginBottom: 20, alignItems: 'center', paddingHorizontal: 20 },
    heroTitle: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
    heroSubtitle: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
    listContent: { padding: 20, paddingBottom: 40 },
    messageBubble: { maxWidth: '85%', padding: 18, borderRadius: 24, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
    messageText: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    inputShadowWrapper: { paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10 },
    quickActionsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    quickActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    quickActionText: { fontSize: 14, fontWeight: '600' },
    inputContainer: { flexDirection: 'row', padding: 8, paddingLeft: 20, borderRadius: 40, borderWidth: 1, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    input: { flex: 1, paddingVertical: 12, fontSize: 16, marginRight: 12 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    largeText: { fontSize: 22, lineHeight: 28 },
    largeInput: { fontSize: 20 }
});
