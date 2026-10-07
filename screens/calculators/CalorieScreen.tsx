import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import IronHeader from '../../components/IronHeader';
import ScrollFloat from '../../components/ScrollFloat';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  Card,
  Chip,
  Field,
  HeightInput,
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

// Mirrors calories_vc.swift (Harris-Benedict revised):
//   male   BMR = 88.361  + 13.397*wt + 4.799*ht - 5.677*age
//   female BMR = 447.593 + 9.247*wt  + 3.098*ht - 4.330*age
//   daily calories = BMR * activity multiplier
const ACTIVITY_LEVELS: { label: string; multiplier: number }[] = [
  { label: 'SEDENTARY', multiplier: 1.2 },
  { label: 'LIGHT', multiplier: 1.375 },
  { label: 'MODERATE', multiplier: 1.55 },
];

export default function CalorieScreen() {
  const { colors } = useThemeMode();
  const styles = useMemo(() => makeCalcStyles(colors), [colors]);
  const navigation = useNavigation<any>();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('MALE');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  const weightUnitLabel = unitSystem === 'metric' ? 'KG' : 'LBS';

  const handleUnitSystemChange = (next: UnitSystem) => {
    if (next === unitSystem) return;
    setWeight((prev) => convertWeightField(prev, unitSystem, next));
    setUnitSystem(next);
  };

  const bmr = useMemo(() => {
    if (!hasCalculated || !isValid(weight, height, age)) return null;
    const w = toKg(toNumber(weight), unitSystem);
    const h = toNumber(height);
    const a = toNumber(age);
    const result =
      gender === 'MALE'
        ? 88.361 + 13.397 * w + 4.799 * h - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
    return Math.round(result);
  }, [hasCalculated, weight, height, age, unitSystem, gender]);

  const calories = useMemo(() => {
    if (bmr === null) return null;
    return Math.round(bmr * ACTIVITY_LEVELS[activityIndex].multiplier);
  }, [bmr, activityIndex]);

  const calculate = () => {
    if (!isValid(weight, height, age)) return;
    setHasCalculated(true);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <IronHeader title="CALORIES" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <ScrollFloat textStyle={styles.pageTitle} duration={1200} distance={20} stagger={0.045}>
            DAILY CALORIES
          </ScrollFloat>
          <Text style={styles.pageSub}>BMR & MAINTENANCE CALORIES FROM ACTIVITY</Text>
        </View>

        <UnitGenderRow
          unitSystem={unitSystem}
          onUnitChange={handleUnitSystemChange}
          gender={gender}
          onGenderChange={setGender}
          styles={styles}
        />

        <Card icon="local-fire-department" title="CALORIE CALCULATOR" colors={colors} styles={styles}>
          <Field label="WEIGHT" value={weight} onChangeText={setWeight} suffix={weightUnitLabel} colors={colors} styles={styles} />
          <HeightInput height={height} onChangeHeight={setHeight} unitSystem={unitSystem} colors={colors} styles={styles} />
          <Field label="AGE" value={age} onChangeText={setAge} suffix="YRS" colors={colors} styles={styles} />

          <Text style={styles.fieldLabel}>ACTIVITY LEVEL</Text>
          <View style={styles.activityWrap}>
            {ACTIVITY_LEVELS.map((lvl, i) => (
              <Chip key={lvl.label} label={lvl.label} active={activityIndex === i} onPress={() => setActivityIndex(i)} styles={styles} />
            ))}
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculate} activeOpacity={0.85}>
            <Text style={styles.calcBtnText}>CALCULATE CALORIES</Text>
            <MaterialIcons name="arrow-forward" size={16} color={colors.onPrimary} />
          </TouchableOpacity>

          <View style={styles.resultRowSplit}>
            {bmr !== null && <ResultRow value={String(bmr)} label="BMR (CAL/DAY)" styles={styles} />}
            {calories !== null && (
              <ResultRow
                value={String(calories)}
                label="DAILY CALORIES"
                sub={ACTIVITY_LEVELS[activityIndex].label}
                color={colors.primary}
                styles={styles}
              />
            )}
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
