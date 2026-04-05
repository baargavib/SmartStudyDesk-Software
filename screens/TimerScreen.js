import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useTimer } from '../utils/timer';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function TimerScreen() {
    const { t, isLargeText, setFocusMode, theme } = useContext(AppContext);

    const handleComplete = async () => {
        Alert.alert(t.sessionComplete || "Session Complete!", t.breakMessage || "Great job! Taking a break.");
        try {
            await supabase.from('sessions').insert([{ duration: POMODORO_SECONDS / 60, date: new Date().toISOString() }]);
        } catch (error) {}
    };

    const { formattedTime, isActive, toggle, stop, secondsLeft, POMODORO_SECONDS } = useTimer(handleComplete);

    // Auto-start timer on mount
    useEffect(() => {
        if (!isActive && secondsLeft === POMODORO_SECONDS) {
            toggle();
        }
    }, [isActive, secondsLeft, POMODORO_SECONDS]);

    const handleStop = async () => {
        // Calculate elapsed time in minutes
        const elapsedSeconds = POMODORO_SECONDS - secondsLeft;
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);

        if (elapsedMinutes > 0) {
            try {
                await supabase.from('sessions').insert([{ duration: elapsedMinutes, date: new Date().toISOString() }]);
            } catch (error) {}
        }
        
        stop();
        setFocusMode(false); // Return to Dashboard
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                
                <Text style={[styles.title, { color: theme.colors.text }, isLargeText && styles.largeText]}>{t.findingFlow}</Text>
                <Text style={[styles.subtitle, { color: theme.colors.subText }]}>{t.timerSubtitle}</Text>
                
                <View style={[styles.timerContainer, { backgroundColor: theme.isDark ? theme.colors.background : '#F1F5F9' }]}>
                    <Text style={[styles.timeText, { color: theme.colors.primary }]}>{formattedTime}</Text>
                </View>
                
                <View style={styles.controls}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.background }]} onPress={() => { stop(); toggle(); }}>
                        <Ionicons name="refresh" size={24} color={theme.colors.subText} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.playButton, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]} onPress={toggle}>
                        <Ionicons name={isActive ? "pause" : "play"} size={32} color="#FFF" style={!isActive && { marginLeft: 4 }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.background }]} onPress={handleStop}>
                        <Ionicons name="close" size={24} color={theme.colors.subText} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 700,
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        // Optional huge soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 30,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 60,
        textAlign: 'center',
        fontWeight: '500',
    },
    timerContainer: {
        width: 320,
        height: 320,
        borderRadius: 160,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    timeText: {
        fontSize: 84,
        fontWeight: '900',
        fontVariant: ['tabular-nums'], 
        letterSpacing: -2,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    largeText: {
        fontSize: 40,
    }
});
