import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../../components/IronHeader';
import ScrollFloat from '../../components/ScrollFloat';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  Card,
  Chip,
  Field,
  ResultRow,
  UnitGenderRow,
  convertWeightField,
  isValid,
  makeCalcStyles,
  toKg,
  toNumber,
  type Gender,
  type UnitSystem,
} from './shared';

// Mirrors protien_vc.swift: required protein (g) = bodyweight(kg) x factor
const ACTIVITIES = [
  'No Exercise',
  'Low level training',
  'Active level training',
  'Sports',
  'Weight training',
] as const;

const MALE_FACTORS = [0.75, 0.89, 1.2, 1.5, 1.7];
const FEMALE_FACTORS = [0.74, 0.86, 1.2, 1.33, 1.4];

export default function ProteinScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeCalcStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('MALE');
  const [weight, setWeight] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [grams, setGrams] = useState<number | null>(null);

  const weightUnitLabel = unitSystem === 'metric' ? 'KG' : 'LBS';

  const handleUnitSystemChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    setWeight((prev) => convertWeightField(prev, unitSystem, next));
    setUnitSystem(next);
  };

  const calculate = () => {
    if (!isValid(weight)) return;
    const w = toKg(toNumber(weight), unitSystem);
    const factor = (gender === 'MALE' ? MALE_FACTORS : FEMALE_FACTORS)[activityIndex];
    setGrams(parseFloat((w * factor).toFixed(1)));
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <IronHeader title="PROTEIN" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            PROTEIN INTAKE
          </ScrollFloat>
          <Text style={styles.pageSub}>DAILY PROTEIN TARGET BY BODYWEIGHT & TRAINING</Text>
        </View>

        <UnitGenderRow
          unitSystem={unitSystem}
          onUnitChange={handleUnitSystemChange}
          gender={gender}
          onGenderChange={setGender}
          styles={styles}
        />

        <Card icon="restaurant" title="PROTEIN CALCULATOR" colors={colors} styles={styles}>
          <Field label="BODYWEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} colors={colors} styles={styles} />

          <Text style={styles.fieldLabel}>TRAINING LEVEL</Text>
          <View style={styles.activityWrap}>
            {ACTIVITIES.map((label, i) => (
              <Chip key={label} label={label.toUpperCase()} active={activityIndex === i} onPress={() => setActivityIndex(i)} styles={styles} />
            ))}
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculate} activeOpacity={0.85}>
            <Text style={styles.calcBtnText}>CALCULATE PROTEIN</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
          {grams !== null && (
            <ResultRow value={`${grams} G`} label="REQUIRED PROTEIN / DAY" sub={ACTIVITIES[activityIndex].toUpperCase()} color={colors.primary} styles={styles} />
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
