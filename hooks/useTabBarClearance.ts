import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_OFFSET, spacing } from '../theme';

// Bottom padding needed so scrollable content clears the floating tab bar, computed
// per device from its actual safe-area inset (gesture nav bar, home indicator, etc.)
// instead of a hardcoded guess.
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + insets.bottom + spacing.stackSm;
}
