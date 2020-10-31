const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    boxShadow: {
      default: "inset 0 0 1rem 0.3rem #ffd700",
    },
    container: {
      center: true,
    },
    fontFamily: {
      sans: [...defaultTheme.fontFamily.sans],
      serif: ["Petrona", ...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
    },
  },
};
