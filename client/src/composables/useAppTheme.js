import { computed } from "vue";
import { useTheme } from "vuetify";

export default function useAppTheme() {
  const theme = useTheme();

  const isDark = computed(() => {
    return theme.global.current.value.dark;
  });

  const restoreSavedTheme = () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      theme.global.name.value = savedTheme;
    }
  };

  const toggle = () => {
    theme.global.name.value = isDark.value ? "light" : "dark";
    localStorage.setItem("selectedTheme", theme.global.name.value);
  };

  return {
    isDark,
    toggle,
    restoreSavedTheme,
  };
}
