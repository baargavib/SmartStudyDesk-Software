import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { supabase } from '../services/supabase';

export default function Dashboard() {
    const { t, isLargeText, setFocusMode, theme, isLargeScreen } = useContext(AppContext);
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Refresh when tab is active

    const [liveTasks, setLiveTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [studyDuration, setStudyDuration] = useState(0); // in minutes
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [perfTab, setPerfTab] = useState('today');

    const loadDashboardData = async () => {
        setLoadingTasks(true);
        try {
            // Load live tasks from Supabase
            const { data: tasksData, error: taskError } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
            if (!taskError && tasksData) setLiveTasks(tasksData);
        } catch (e) {
            console.log("Supabase Tasks missing/error", e);
        }

        try {
            // Load sessions from Supabase to calculate total metrics
            const { data: sessionData, error: sessionError } = await supabase.from('sessions').select('duration');
            if (!sessionError && sessionData) {
                const totalMins = sessionData.reduce((acc, curr) => acc + (curr.duration || 0), 0);
                setStudyDuration(totalMins);
            }
        } catch(e) {
            console.log("Supabase Sessions missing/error", e);
        }
        setLoadingTasks(false);
    };

    // Auto-fetch whenever the user returns to the Dashboard
    useEffect(() => {
        if (isFocused) {
            loadDashboardData();
        }
    }, [isFocused]);

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        const newTitle = newTaskTitle.trim();
        setNewTaskTitle(''); // instant clear
        
        // Optimistic UI Append
        const tempId = Math.random();
        setLiveTasks([...liveTasks, { id: tempId, title: newTitle, is_completed: false }]);
        
        try {
            const { data, error } = await supabase.from('tasks').insert([{ title: newTitle, is_completed: false }]).select();
            if (data && data.length > 0) {
                setLiveTasks(prev => prev.map(t => t.id === tempId ? data[0] : t));
            }
        } catch (e) {
            console.log(e);
        }
    };

    const toggleTask = async (task) => {
        const newVal = !task.is_completed;
        // Optimistic toggle
        setLiveTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: newVal } : t));
        
        try {
            await supabase.from('tasks').update({ is_completed: newVal }).eq('id', task.id);
        } catch(e) {
             console.log(e);
        }
    };
    
    // Dynamic Recommendation Engine System Engine
    const completedTasksCount = liveTasks.filter(t => t.is_completed).length;
    const pendingTasksCount = liveTasks.length - completedTasksCount;
    
    let aiSuggestionHeader = t.readyToFocus;
    let aiSuggestion = t.readyToFocusMsg;
    let aiIcon = "bulb";

    if (studyDuration > 90) {
        aiSuggestionHeader = t.mentalFatigue;
        aiSuggestion = t.mentalFatigueMsg;
        aiIcon = "cafe";
    } else if (liveTasks.length > 0 && pendingTasksCount === 0) {
        aiSuggestionHeader = t.perfectScore;
        aiSuggestion = t.perfectScoreMsg;
        aiIcon = "trophy";
    } else if (pendingTasksCount >= 3) {
        aiSuggestionHeader = t.heavyWorkload;
        aiSuggestion = t.heavyWorkloadMsg;
        aiIcon = "flash";
    } else if (studyDuration > 0) {
        aiSuggestionHeader = t.greatMomentum;
        aiSuggestion = t.greatMomentumMsg;
        aiIcon = "flame";
    }

    const handleFocusStart = () => {
        setFocusMode(true);
    };

    // Transform raw minutes into a beautiful 'h m' UI display 
    const displayHours = Math.floor(studyDuration / 60);
    const displayMins = studyDuration % 60;
    const timeDisplay = displayHours > 0 ? `${displayHours}h ${displayMins > 0 ? displayMins + 'm' : ''}` : `${displayMins}m`;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.welcomeText, { color: theme.colors.text }, isLargeText && styles.largeText]}>{t.welcomeBack}, Alex!</Text>
                    <Text style={[styles.subjectText, { color: theme.colors.subText }]}>{t.todaysAssignments} • {completedTasksCount} / {liveTasks.length}</Text>
                </View>
                <View style={[styles.profileCircle, { backgroundColor: theme.colors.primary }]}>
                    <Text style={{color: '#FFF', fontWeight: 'bold' }}>AL</Text>
                </View>
            </View>

            {/* Smart Tracker Suggestion Banner */}
            <View style={[styles.suggestionBanner, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary + '30', borderWidth: 1 }]}>
                <Ionicons name={aiIcon} size={28} color={theme.colors.primary} style={{marginRight: 16}} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.primary, marginBottom: 4 }}>{aiSuggestionHeader}</Text>
                    <Text style={{ fontSize: 14, color: theme.colors.text, lineHeight: 20 }}>{aiSuggestion}</Text>
                </View>
            </View>

            <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
                
                {/* Left Column (Stats) */}
                <View style={[styles.statsColumn, isLargeScreen && styles.statsColumnLarge]}>
                    <TouchableOpacity style={[styles.statCard, { backgroundColor: theme.isDark ? theme.colors.secondary + '25' : '#DCFCE7' }]} activeOpacity={0.8}>
                        <View style={styles.statHeader}>
                            <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>{t.focusLog || 'FOCUS LOG'}</Text>
                            <Ionicons name="time" size={20} color={theme.colors.secondary} />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.secondary }]}>{timeDisplay}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.statCard, { backgroundColor: theme.isDark ? theme.colors.accent + '25' : '#F3E8FF' }]} activeOpacity={0.8}>
                        <View style={styles.statHeader}>
                            <Text style={[styles.statLabel, { color: theme.colors.accent }]}>{t.pending || 'PENDING'}</Text>
                            <Ionicons name="checkbox" size={20} color={theme.colors.accent} />
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.accent }]}>{pendingTasksCount}</Text>
                    </TouchableOpacity>
                </View>

                {/* Right Column / Block (Focus Timer Widget) */}
                <View style={[styles.focusWidget, { backgroundColor: theme.colors.deepNavy }, isLargeScreen && styles.focusWidgetLarge]}>
                    <Text style={styles.focusWidgetSubtitle}>{t.readyFocus || 'READY FOCUS NOW'}</Text>
                    <Text style={styles.focusWidgetTime}>25:00</Text>
                    <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#FFF' }]} onPress={handleFocusStart}>
                        <Text style={[styles.startBtnText, { color: theme.colors.deepNavy }]}>{t.startFocus || 'START FOCUS'}</Text>
                        <Ionicons name="play" size={18} color={theme.colors.deepNavy} />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={[styles.lowerGrid, isLargeScreen && styles.lowerGridLarge]}>
                {/* Dynamic Task List */}
                <View style={[styles.cardBlock, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }, isLargeScreen && styles.recentNotesLarge]}>
                     <View style={styles.cardHeader}>
                         <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t.todaysAssignments || "Today's Assignments"}</Text>
                     </View>
                     
                     <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                         <TextInput 
                            style={[styles.taskInput, { color: theme.colors.text }]}
                            placeholder={t.addNewTask}
                            placeholderTextColor={theme.colors.subText}
                            value={newTaskTitle}
                            onChangeText={setNewTaskTitle}
                            onSubmitEditing={handleAddTask}
                         />
                         <TouchableOpacity onPress={handleAddTask} style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}>
                             <Ionicons name="add" size={20} color="#FFF" />
                         </TouchableOpacity>
                     </View>

                     {loadingTasks ? (
                         <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 20 }} />
                     ) : liveTasks.length === 0 ? (
                         <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.subText, fontStyle: 'italic' }}>{t.noTasks}</Text>
                     ) : (
                         liveTasks.map((task) => (
                             <TouchableOpacity 
                                key={task.id} 
                                style={[styles.noteItem, { borderBottomColor: theme.colors.border }]}
                                onPress={() => toggleTask(task)}
                            >
                                <Ionicons 
                                    name={task.is_completed ? "checkmark-circle" : "ellipse-outline"} 
                                    size={24} 
                                    color={task.is_completed ? theme.colors.secondary : theme.colors.subText} 
                                    style={{marginRight: 12}}
                                />
                                <Text style={{ color: task.is_completed ? theme.colors.subText : theme.colors.text, fontSize: 16, fontWeight: '500', textDecorationLine: task.is_completed ? 'line-through' : 'none', flex: 1 }}>
                                    {task.title}
                                </Text>
                             </TouchableOpacity>
                         ))
                     )}
                </View>

                {/* AI Assistant Widget */}
                <View style={[styles.cardBlock, { backgroundColor: theme.colors.deepNavy }, isLargeScreen && styles.aiWidgetLarge]}>
                     <View style={styles.cardHeader}>
                         <Text style={[styles.cardTitle, { color: '#FFF' }]}>{t.aiAssistantWidget || "AI Assistant"}</Text>
                         <Ionicons name="sparkles" size={24} color="#FFF" />
                     </View>
                     <Text style={{ color: 'rgba(255,255,255,0.7)', marginVertical: 16, lineHeight: 22, fontSize: 15 }}>
                         {t.aiReadyTopic}
                     </Text>
                     <TouchableOpacity style={[styles.aiInput, { backgroundColor: 'rgba(255,255,255,0.1)' }]} onPress={() => navigation.navigate('AI Assistant')}>
                         <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{t.askQuestion || "Ask a question..."}</Text>
                         <View style={{ backgroundColor: theme.colors.primary, padding: 6, borderRadius: 12 }}>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                         </View>
                     </TouchableOpacity>
                </View>
            </View>

            {/* Performance Summary Section */}
            <View style={[styles.perfSection, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }, isLargeScreen && { marginTop: 16 }]}>
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="analytics" size={24} color={theme.colors.primary} />
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{t.performanceSummary}</Text>
                    </View>
                    {/* Day / Week Toggle */}
                    <View style={[styles.perfToggle, { backgroundColor: theme.colors.background }]}>
                        <TouchableOpacity
                            style={[styles.perfToggleBtn, perfTab === 'today' && { backgroundColor: theme.colors.primary }]}
                            onPress={() => setPerfTab('today')}
                        >
                            <Text style={[styles.perfToggleText, { color: perfTab === 'today' ? '#FFF' : theme.colors.subText }]}>{t.today}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.perfToggleBtn, perfTab === 'week' && { backgroundColor: theme.colors.primary }]}
                            onPress={() => setPerfTab('week')}
                        >
                            <Text style={[styles.perfToggleText, { color: perfTab === 'week' ? '#FFF' : theme.colors.subText }]}>{t.thisWeek}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Mini Cards */}
                <View style={[styles.perfStatsRow, isLargeScreen && { gap: 16 }]}>
                    <View style={[styles.perfMiniCard, { backgroundColor: theme.isDark ? theme.colors.secondary + '20' : '#DCFCE7' }]}>
                        <Ionicons name="checkmark-done-circle" size={28} color={theme.colors.secondary} />
                        <Text style={[styles.perfMiniValue, { color: theme.colors.secondary }]}>
                            {perfTab === 'today' ? completedTasksCount : completedTasksCount * 5}
                        </Text>
                        <Text style={[styles.perfMiniLabel, { color: theme.colors.subText }]}>{t.tasksCompleted}</Text>
                    </View>
                    <View style={[styles.perfMiniCard, { backgroundColor: theme.isDark ? theme.colors.primary + '20' : '#DBEAFE' }]}>
                        <Ionicons name="time" size={28} color={theme.colors.primary} />
                        <Text style={[styles.perfMiniValue, { color: theme.colors.primary }]}>
                            {perfTab === 'today' ? timeDisplay : (displayHours * 5 > 0 ? `${displayHours * 5}h` : `${displayMins * 5}m`)}
                        </Text>
                        <Text style={[styles.perfMiniLabel, { color: theme.colors.subText }]}>{t.focusTime}</Text>
                    </View>
                    <View style={[styles.perfMiniCard, { backgroundColor: theme.isDark ? theme.colors.accent + '20' : '#F3E8FF' }]}>
                        <Ionicons name="flame" size={28} color={theme.colors.accent} />
                        <Text style={[styles.perfMiniValue, { color: theme.colors.accent }]}>
                            {perfTab === 'today' ? (studyDuration > 0 ? 1 : 0) : 5}
                        </Text>
                        <Text style={[styles.perfMiniLabel, { color: theme.colors.subText }]}>{t.streak} ({t.days})</Text>
                    </View>
                </View>

                {/* Weekly Goal Progress */}
                <View style={styles.perfGoalSection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={[styles.perfGoalLabel, { color: theme.colors.text }]}>{t.weeklyGoal}</Text>
                        <Text style={[styles.perfGoalLabel, { color: theme.colors.subText }]}>
                            {perfTab === 'today' ? `${completedTasksCount}/5` : `${Math.min(completedTasksCount * 5, 25)}/25`} {t.completed}
                        </Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
                        <View style={[
                            styles.progressBarFill,
                            { 
                                backgroundColor: theme.colors.primary,
                                width: perfTab === 'today' 
                                    ? `${Math.min((completedTasksCount / 5) * 100, 100)}%`
                                    : `${Math.min((completedTasksCount * 5 / 25) * 100, 100)}%`
                            }
                        ]} />
                    </View>
                    <Text style={[styles.perfMotivation, { color: theme.colors.subText }]}>
                        {(() => {
                            const pct = perfTab === 'today' ? (completedTasksCount / 5) : (completedTasksCount * 5 / 25);
                            if (pct >= 0.8) return t.greatWork;
                            if (pct >= 0.5) return t.almostThere;
                            return t.needsWork;
                        })()}
                    </Text>
                </View>

                {/* Areas to Improve */}
                <View style={[styles.perfTipsSection, { borderTopColor: theme.colors.border }]}>
                    <Text style={[styles.perfTipsTitle, { color: theme.colors.text }]}>{t.areasToImprove}</Text>
                    <Text style={[styles.perfTipItem, { color: theme.colors.subText }]}>{t.tipConsistency}</Text>
                    <Text style={[styles.perfTipItem, { color: theme.colors.subText }]}>{t.tipBreaks}</Text>
                    <Text style={[styles.perfTipItem, { color: theme.colors.subText }]}>{t.tipVariety}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    suggestionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 6,
    },
    subjectText: {
        fontSize: 16,
    },
    profileCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'column',
        gap: 16,
        marginBottom: 16,
    },
    gridLarge: {
        flexDirection: 'row',
    },
    statsColumn: {
        flexDirection: 'row',
        gap: 16,
    },
    statsColumnLarge: {
        flex: 1,
        flexDirection: 'column', 
    },
    statCard: {
        flex: 1,
        borderRadius: 24,
        padding: 24,
        minHeight: 140,
        justifyContent: 'center',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 48,
        fontWeight: '900',
    },
    focusWidget: {
        flex: 1,
        borderRadius: 32,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    focusWidgetLarge: {
        flex: 1.5,
    },
    focusWidgetSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 12,
    },
    focusWidgetTime: {
        color: '#FFF',
        fontSize: 72,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
        marginBottom: 24,
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 8,
    },
    startBtnText: {
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    lowerGrid: {
        flexDirection: 'column',
        gap: 16,
    },
    lowerGridLarge: {
        flexDirection: 'row',
    },
    cardBlock: {
        flex: 1,
        borderRadius: 24,
        padding: 24,
    },
    recentNotesLarge: {
        flex: 1.5,
    },
    aiWidgetLarge: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingBottom: 12,
        marginBottom: 8,
    },
    taskInput: {
        flex: 1,
        fontSize: 16,
    },
    addBtn: {
        padding: 6,
        borderRadius: 16,
    },
    noteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    aiInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        paddingLeft: 16,
        borderRadius: 20,
        marginTop: 'auto',
    },
    largeText: {
        fontSize: 34,
    },
    // Performance Summary Styles
    perfSection: {
        borderRadius: 24,
        padding: 24,
        marginTop: 16,
    },
    perfToggle: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 3,
    },
    perfToggleBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    perfToggleText: {
        fontSize: 13,
        fontWeight: '700',
    },
    perfStatsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    perfMiniCard: {
        flex: 1,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        gap: 6,
    },
    perfMiniValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    perfMiniLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    perfGoalSection: {
        marginBottom: 16,
    },
    perfGoalLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    perfMotivation: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 8,
        fontStyle: 'italic',
    },
    perfTipsSection: {
        borderTopWidth: 1,
        paddingTop: 16,
    },
    perfTipsTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 12,
    },
    perfTipItem: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 8,
        fontWeight: '500',
    },
});
