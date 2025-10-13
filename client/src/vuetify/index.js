// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VNumberInput } from "vuetify/labs/components";

export default createVuetify({
  components: {
    VNumberInput, // Labs components should be explicitly imported here
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#F5F5F5", // Light gray background
          surface: "#FFFFFF", // White for surfaces and modals
          primary: "#3F51B5", // Indigo for primary actions (same as accent in dark mode)
          secondary: "#757575", // Medium gray for secondary text
          accent: "#5C6BC0", // Muted indigo for accents and hover states
          error: "#EF5350", // Soft red for error states
          info: "#42A5F5", // Light blue for info and highlights
          success: "#66BB6A", // Soft green for success states
          warning: "#FFA726", // Orange for warnings
          text: "#212121", // Dark gray text
          "on-surface": "#424242", // Darker gray text on surface elements
          "on-primary": "#FFFFFF", // White text on primary buttons
          "on-secondary": "#FFFFFF", // White text on secondary buttons
          "button-hover": "#5C6BC0", // Muted indigo for button hover states
        },
      },
      dark: {
        colors: {
          background: "#181818", // Deep black background
          surface: "#242424", // Dark gray for surfaces and modals
          primary: "#5C6BC0", // Muted indigo for primary actions
          secondary: "#9E9E9E", // Soft gray for secondary text
          accent: "#3F51B5", // Indigo for accents and hover states
          error: "#E57373", // Soft red for error states
          info: "#64B5F6", // Light blue for info and highlights
          success: "#81C784", // Soft green for success states
          warning: "#FFB74D", // Orange for warnings
          text: "#EEEEEE", // Light gray text
          "on-surface": "#BDBDBD", // Light gray text on surfaces
          "on-primary": "#FFFFFF", // White text on primary buttons
          "on-secondary": "#FFFFFF", // White text on secondary buttons
          "button-hover": "#3F51B5", // Indigo for button hover states
        },
      },
    },
  },
});
