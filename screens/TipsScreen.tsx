import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import IronHeader from '../components/IronHeader';
import ScrollFloat from '../components/ScrollFloat';
import { darkColors, typography, spacing, radius } from '../theme';
import { useThemeMode } from '../hooks/useThemeMode';
import { GYM_TIPS } from '../data/gymTips';

export default function TipsScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <IronHeader title="GYMCOM" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1400} distance={22} stagger={0.045}>
            IRON TIPS.
          </ScrollFloat>
          <Text style={styles.pageSub}>TEN RULES THE LEGENDS TRAINED BY.</Text>
        </View>

        {GYM_TIPS.map((tip, i) => (
          <View key={tip.id} style={styles.card}>
            <View style={styles.imageWrap}>
              <Image source={tip.image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top center" />
              <LinearGradient
                colors={['transparent', 'rgba(19,19,19,0.35)', 'rgba(19,19,19,0.9)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.tipNumber}>{String(i + 1).padStart(2, '0')}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{tip.category}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{tip.title}</Text>
              <Text style={styles.cardText}>{tip.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useThemeMode>['colors']) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.marginMobile, paddingBottom: 120, gap: spacing.stackMd },
    pageHeader: {
      gap: spacing.stackSm,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceContainerHighest,
      paddingBottom: spacing.stackMd,
    },
    pageTitle: {
      ...typography.displayXl,
      fontSize: 44,
      lineHeight: 50,
      paddingTop: 6,
      color: colors.onSurface,
      textTransform: 'uppercase',
    },
    pageSub: { ...typography.bodyLg, color: colors.onSurfaceVariant },

    card: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.secondaryContainer,
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    imageWrap: { width: '100%', aspectRatio: 16 / 10, justifyContent: 'flex-end' },
    imageOverlay: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: spacing.gutter,
    },
    tipNumber: {
      ...typography.displayXl,
      fontSize: 40,
      lineHeight: 40,
      color: darkColors.onSurface,
    },
    categoryTag: {
      borderWidth: 1,
      borderColor: darkColors.outline,
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: 'rgba(19,19,19,0.7)',
    },
    categoryText: { ...typography.labelCaps, fontSize: 10, color: darkColors.primary },

    cardBody: { padding: spacing.marginMobile, gap: spacing.stackSm },
    cardTitle: {
      ...typography.headlineLgMobile,
      fontSize: 24,
      lineHeight: 30,
      color: colors.onSurface,
      textTransform: 'uppercase',
    },
    cardText: { ...typography.bodyMd, fontSize: 14, lineHeight: 22, color: colors.onSurfaceVariant },
  });
