import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { typography, spacing, radius } from '../../theme';
import { useThemeMode } from '../../hooks/useThemeMode';

export type ThemeColors = ReturnType<typeof useThemeMode>['colors'];
export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'MALE' | 'FEMALE';
export type Styles = ReturnType<typeof makeCalcStyles>;

export function toNumber(value: string) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : NaN;
}

export function isValid(...values: string[]) {
  return values.every((v) => v.trim() !== '' && Number.isFinite(toNumber(v)) && toNumber(v) > 0);
}

export function toKg(value: number, unit: UnitSystem) {
  return unit === 'imperial' ? value * 0.453592 : value;
}

export function toCm(value: number, unit: UnitSystem) {
  return unit === 'imperial' ? value * 2.54 : value;
}

export function kgToLbs(kg: number) {
  return kg * 2.20462;
}

export function cmToIn(cm: number) {
  return cm / 2.54;
}

export function convertWeightField(value: string, from: UnitSystem, to: UnitSystem) {
  const n = toNumber(value);
  if (!Number.isFinite(n)) return value;
  if (from === to) return value;
  const kg = toKg(n, from);
  const converted = to === 'imperial' ? kgToLbs(kg) : kg;
  return String(parseFloat(converted.toFixed(1)));
}

export function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

export function feetInchesToCm(feet: number, inches: number) {
  return Math.round((feet * 12 + inches) * 2.54);
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  suffix,
  colors,
  styles,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  colors: ThemeColors;
  styles: Styles;
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={styles.fieldInputRow}>
        <TextInput
          style={styles.fieldInput}
          keyboardType="numeric"
          keyboardAppearance="dark"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder ?? '0'}
          placeholderTextColor={colors.surfaceContainerHighest}
        />
        {suffix ? <Text style={styles.fieldSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

export function HeightInput({
  height,
  onChangeHeight,
  unitSystem,
  colors,
  styles,
}: {
  height: string;
  onChangeHeight: (v: string) => void;
  unitSystem: UnitSystem;
  colors: ThemeColors;
  styles: Styles;
}) {
  if (unitSystem === 'metric') {
    return <Field label="HEIGHT" value={height} onChangeText={onChangeHeight} suffix="CM" colors={colors} styles={styles} />;
  }

  const cm = toNumber(height);
  const { feet, inches } = cmToFeetInches(Number.isFinite(cm) ? cm : 0);
  const feetStr = height ? String(feet) : '';
  const inchesStr = height ? String(inches) : '';

  const setFeet = (v: string) => {
    const f = parseInt(v, 10) || 0;
    onChangeHeight(v.trim() === '' ? '' : String(feetInchesToCm(f, inches)));
  };
  const setInches = (v: string) => {
    const i = parseInt(v, 10) || 0;
    onChangeHeight(String(feetInchesToCm(feet, i)));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>HEIGHT</Text>
      <View style={styles.fieldRow}>
        <Field label="" value={feetStr} onChangeText={setFeet} suffix="FT" colors={colors} styles={styles} />
        <Field label="" value={inchesStr} onChangeText={setInches} suffix="IN" colors={colors} styles={styles} />
      </View>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ResultRow({
  value,
  label,
  sub,
  color,
  styles,
}: {
  value: string;
  label: string;
  sub?: string;
  color?: string;
  styles: Styles;
}) {
  return (
    <View style={styles.result}>
      <Text style={[styles.resultValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.resultLabel}>{label}</Text>
      {sub ? <Text style={[styles.resultSub, color ? { color } : null]}>{sub}</Text> : null}
    </View>
  );
}

export function Card({
  icon,
  title,
  children,
  colors,
  styles,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  children: React.ReactNode;
  colors: ThemeColors;
  styles: Styles;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name={icon} size={18} color={colors.primary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function UnitGenderRow({
  unitSystem,
  onUnitChange,
  gender,
  onGenderChange,
  showGender = true,
  styles,
}: {
  unitSystem: UnitSystem;
  onUnitChange: (u: UnitSystem) => void;
  gender?: Gender;
  onGenderChange?: (g: Gender) => void;
  showGender?: boolean;
  styles: Styles;
}) {
  return (
    <>
      <View style={styles.unitRow}>
        <Chip label="KG" active={unitSystem === 'metric'} onPress={() => onUnitChange('metric')} styles={styles} />
        <Chip label="POUNDS" active={unitSystem === 'imperial'} onPress={() => onUnitChange('imperial')} styles={styles} />
        {showGender && gender && onGenderChange ? (
          <>
            <View style={styles.unitRowSpacer} />
            <Chip label="MALE" active={gender === 'MALE'} onPress={() => onGenderChange('MALE')} styles={styles} />
            <Chip label="FEMALE" active={gender === 'FEMALE'} onPress={() => onGenderChange('FEMALE')} styles={styles} />
          </>
        ) : null}
      </View>
      <Text style={styles.unitHint}>
        KG = METRIC (WEIGHT IN KG, HEIGHT IN CM) · POUNDS = IMPERIAL (WEIGHT IN LBS, HEIGHT IN FT/IN)
      </Text>
    </>
  );
}

export function makeCalcStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.marginMobile, paddingBottom: 120, gap: spacing.stackMd },
    pageHeader: { gap: 4 },
    pageTitle: { ...typography.displayXl, fontSize: 32, lineHeight: 38, color: colors.primary, textTransform: 'uppercase' },
    pageSub: { ...typography.labelCaps, fontSize: 11, color: colors.onSurfaceVariant },

    unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    unitRowSpacer: { width: spacing.stackSm },
    chip: { borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.surfaceContainerLow },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
    chipTextActive: { color: colors.onPrimary },
    unitHint: { ...typography.labelCaps, fontSize: 9, lineHeight: 13, color: colors.onSurfaceVariant, opacity: 0.7 },

    card: {
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.secondaryContainer,
      borderRadius: radius.md,
      padding: spacing.marginMobile,
      gap: spacing.stackSm,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    cardTitle: { ...typography.headlineMd, fontSize: 15, color: colors.onSurface, textTransform: 'uppercase' },

    fieldRow: { flexDirection: 'row', gap: spacing.stackSm },
    field: { flex: 1, gap: 4 },
    fieldLabel: { ...typography.labelCaps, fontSize: 10, color: colors.onSurfaceVariant },
    fieldInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 48,
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.sm,
      paddingHorizontal: 12,
    },
    fieldInput: {
      ...typography.statsNum,
      fontSize: 18,
      lineHeight: 22,
      color: colors.onSurface,
      flex: 1,
      paddingVertical: 10,
    },
    fieldSuffix: {
      ...typography.labelCaps,
      fontSize: 10,
      lineHeight: 14,
      color: colors.onSurfaceVariant,
      marginLeft: 6,
    },

    activityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

    calcBtn: {
      backgroundColor: colors.primary,
      borderRadius: radius.sm,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
    },
    calcBtnText: { ...typography.labelCaps, color: colors.onPrimary },

    result: { alignItems: 'center', backgroundColor: colors.surfaceContainerLowest, borderRadius: radius.sm, padding: 16, marginTop: 4, flex: 1 },
    resultRowSplit: { flexDirection: 'row', gap: spacing.stackSm },
    resultValue: { ...typography.statsNum, fontSize: 32, color: colors.onSurface },
    resultLabel: { ...typography.labelCaps, fontSize: 9, color: colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' },
    resultSub: { ...typography.labelCaps, fontSize: 10, marginTop: 4, color: colors.onSurfaceVariant },

    hubCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gutter,
      backgroundColor: colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: colors.secondaryContainer,
      borderRadius: radius.md,
      padding: spacing.marginMobile,
    },
    hubIconWrap: {
      width: 46,
      height: 46,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    hubTextWrap: { flex: 1, gap: 2 },
    hubTitle: { ...typography.headlineMd, fontSize: 17, color: colors.onSurface, textTransform: 'uppercase' },
    hubDesc: { ...typography.bodyMd, fontSize: 12, color: colors.onSurfaceVariant },
  });
}
