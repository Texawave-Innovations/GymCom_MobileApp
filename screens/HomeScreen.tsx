import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { typography, spacing, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';
import { useTabBarClearance } from '../hooks/useTabBarClearance';
import { PPL_SPLIT } from '../data/pplSplit';
import { getTodaysLesson } from '../data/ironLessons';

// JS getDay(): 0=Sun..6=Sat. PPL split runs Mon=Day1 ... Sun=Day7(rest).
function getTodaysSplitDay() {
  const jsDay = new Date().getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
  return PPL_SPLIT[dayIndex];
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const tabBarClearance = useTabBarClearance();
  const todaysDay = getTodaysSplitDay();
  const todaysLesson = getTodaysLesson();

  return (
    <View style={styles.screen}>
      <IronHeader />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}>
        <View style={styles.hero}>
          <Image
            source={require('../assets/hero-page.jpg')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="center"
          />
          <LinearGradient
            colors={['transparent', 'rgba(19,19,19,0.25)', 'rgba(19,19,19,0.85)', colors.surface]}
            locations={[0, 0.45, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <ScrollFloat textStyle={styles.heroTitle} duration={1400} distance={22} stagger={0.04}>
              {"TRAIN HARD.\nBUILD LEGACY."}
            </ScrollFloat>
            <View style={styles.featuredCard}>
              <View style={styles.featuredTop}>
                <View style={styles.badge}><Text style={styles.badgeText}>Today's Focus</Text></View>
                <MaterialIcons name="fitness-center" size={20} color={colors.outline} />
              </View>
              <Text style={styles.featuredTitle}>
                {todaysDay.isRest ? 'REST DAY' : todaysDay.title.toUpperCase()}
              </Text>
              <Text style={styles.featuredSub}>
                {todaysDay.isRest
                  ? todaysDay.subtitle
                  : `${todaysDay.subtitle} • ${todaysDay.exercises.length} Exercises`}
              </Text>
              <TouchableOpacity
                style={[styles.startBtn, todaysDay.isRest && styles.startBtnDisabled]}
                disabled={todaysDay.isRest}
                onPress={() => navigation.navigate('WorkoutSplit', { id: 'push-pull-legs', openDayId: todaysDay.id })}
              >
                <Text style={styles.startBtnText}>{todaysDay.isRest ? 'REST & RECOVER' : 'START WORKOUT'}</Text>
                {!todaysDay.isRest && <MaterialIcons name="play-arrow" size={20} color={colors.onPrimary} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.marginMobile, marginTop: spacing.stackSm }]}>
          <Text style={styles.sectionTitle}>TODAY'S IRON LESSON</Text>
          <View style={styles.lessonCard}>
            <View style={styles.badge}><Text style={styles.badgeText}>{todaysLesson.tag}</Text></View>
            <Text style={[styles.featuredTitle, { marginTop: spacing.stackSm }]}>{todaysLesson.title}</Text>
            <Text style={styles.lessonBody}>{todaysLesson.body}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceContainerLowest },
  content: {},
  hero: { width: '100%', height: 520, justifyContent: 'flex-end', overflow: 'hidden' },
  heroContent: { padding: spacing.marginMobile, gap: spacing.stackSm },
  heroTitle: { ...typography.displayXl, fontSize: 34, lineHeight: 38, color: colors.primary, textTransform: 'uppercase' },
  featuredCard: {
    marginTop: spacing.stackSm,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    padding: spacing.gutter,
  },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.stackSm },
  badge: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { ...typography.labelCaps, color: colors.primary },
  featuredTitle: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase', marginBottom: 4 },
  featuredSub: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginBottom: spacing.stackMd },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startBtnText: { ...typography.headlineMd, fontSize: 18, color: colors.onPrimary, textTransform: 'uppercase' },
  startBtnDisabled: { opacity: 0.6 },
  section: { marginTop: spacing.stackLg, gap: spacing.stackSm },
  sectionTitle: { ...typography.headlineMd, color: colors.onSurface, textTransform: 'uppercase' },
  lessonCard: { backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.md, padding: spacing.stackMd },
  lessonBody: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 8 },
});
