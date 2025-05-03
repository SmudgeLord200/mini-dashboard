// src/theme.ts
import { alpha, PaletteMode } from '@mui/material/styles';

// --- Dark Mode Colors ---
const darkPrimaryBackgroundColor = '#2F234D';
const darkSecondaryBackgroundColor = '#3e305e';
const darkPrimaryTextColor = '#fff';
const darkTableHeaderTextColor = '#9ED510';
const darkTableCellTextColor = '#AEEB13';
const darkSecondaryTextColor = '#bdbdbd';
const darkDisabledTextColor = alpha(darkPrimaryTextColor, 0.5);
const darkDisabledBorderColor = alpha(darkPrimaryTextColor, 0.3);
const darkHoverBackgroundColor = alpha(darkPrimaryTextColor, 0.08);
const darkSelectedBackgroundColor = alpha(darkPrimaryTextColor, 0.15);
const darkChartGridColor = alpha(darkPrimaryTextColor, 0.2);
const darkDividerColor = darkSecondaryTextColor;

// --- Light Mode Colors ---
const lightPrimaryBackgroundColor = '#ffffff';
const lightSecondaryBackgroundColor = '#f5f5f5'; // Light grey
const lightPrimaryTextColor = '#000000';
const lightTableHeaderTextColor = '#1b5e20'; // Dark green
const lightTableCellTextColor = '#2e7d32'; // Medium green
const lightSecondaryTextColor = '#757575'; // Grey
const lightDisabledTextColor = alpha(lightPrimaryTextColor, 0.5);
const lightDisabledBorderColor = alpha(lightPrimaryTextColor, 0.3);
const lightHoverBackgroundColor = alpha(lightPrimaryTextColor, 0.08);
const lightSelectedBackgroundColor = alpha(lightPrimaryTextColor, 0.15);
const lightChartGridColor = alpha(lightPrimaryTextColor, 0.2);
const lightDividerColor = alpha(lightPrimaryTextColor, 0.12);

// --- Define Interfaces for Custom Palette Groups ---
// Define the structure you *actually* use for each custom group

interface CustomBackgroundPalette {
  main: string;
  secondary: string; // Changed from 'dark' to match implementation key
}
// Optional: Define options type if needed for theme merging/creation flexibility
interface CustomBackgroundPaletteOptions {
  main?: string;
  secondary?: string;
}

interface CustomTextPalette {
  main: string;
  secondary: string; // Changed from 'dark' to match implementation key
  tableHeader: string;
  tableCell: string;
  disabled: string;
}
interface CustomTextPaletteOptions {
  main?: string;
  secondary?: string;
  tableHeader?: string;
  tableCell?: string;
  disabled?: string;
}

interface CustomActionPalette {
  hoverBackground: string; // Changed from 'main' to match implementation key
  selectedBackground: string; // Changed from 'dark' to match implementation key
}
interface CustomActionPaletteOptions {
  hoverBackground?: string;
  selectedBackground?: string;
}

interface CustomBorderPalette {
  main: string;
  disabled: string;
}
interface CustomBorderPaletteOptions {
  main?: string;
  disabled?: string;
}

interface CustomChartPalette {
  background: string;
  text: string;
  gridLines: string;
  // Add more chart-specific colors as needed (e.g., tooltipBackground, axisLabels)
}
interface CustomChartPaletteOptions {
  background?: string;
  text?: string;
  gridLines?: string;
}

// --- Define Interfaces for Stats Palette ---
interface StatsPalette {
    totalReadings: { background: string; text: string };
    uniqueBoxes: { background: string; text: string };
    avgReading: { background: string; text: string };
    minReading: { background: string; text: string };
    maxReading: { background: string; text: string };
}
interface StatsPaletteOptions {
    totalReadings?: { background?: string; text?: string };
    uniqueBoxes?: { background?: string; text?: string };
    avgReading?: { background?: string; text?: string };
    minReading?: { background?: string; text?: string };
    maxReading?: { background?: string; text?: string };
}


// --- Augment the Palette interface with Custom Interfaces ---
declare module '@mui/material/styles' {
  // Extend the Palette interface
  interface Palette {
    customBackground: CustomBackgroundPalette;
    customText: CustomTextPalette;
    customAction: CustomActionPalette;
    customBorder: CustomBorderPalette;
    customChart: CustomChartPalette;
    stats: StatsPalette; // Add stats palette
  }

  // Extend the PaletteOptions interface (used during createTheme)
  interface PaletteOptions {
    customBackground?: CustomBackgroundPaletteOptions;
    customText?: CustomTextPaletteOptions;
    customAction?: CustomActionPaletteOptions;
    customBorder?: CustomBorderPaletteOptions;
    customChart?: CustomChartPaletteOptions;
    stats?: StatsPaletteOptions; // Add stats palette options
  }
}

// --- createTheme Implementation (Adjust keys to match interfaces) ---
// Function to get theme configuration based on mode
export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                // Dark mode palette values
                background: {
                    default: '#1a1a2e', // Dark page background
                    paper: darkPrimaryBackgroundColor,
                },
                text: {
                    primary: darkPrimaryTextColor,
                    secondary: darkSecondaryTextColor,
                    disabled: darkDisabledTextColor,
                },
                divider: darkDividerColor,
                customBackground: {
                    main: darkPrimaryBackgroundColor,
                    secondary: darkSecondaryBackgroundColor,
                },
                customText: {
                    main: darkPrimaryTextColor,
                    secondary: darkSecondaryTextColor,
                    tableHeader: darkTableHeaderTextColor,
                    tableCell: darkTableCellTextColor,
                    disabled: darkDisabledTextColor,
                },
                customAction: {
                    hoverBackground: darkHoverBackgroundColor,
                    selectedBackground: darkSelectedBackgroundColor,
                },
                customBorder: {
                    main: darkSecondaryTextColor,
                    disabled: darkDisabledBorderColor,
                },
                customChart: {
                    background: darkPrimaryBackgroundColor,
                    text: darkPrimaryTextColor,
                    gridLines: darkChartGridColor,
                },
                stats: { // Define stats colors for dark mode
                    totalReadings: { background: alpha(darkTableHeaderTextColor, 0.2), text: darkTableHeaderTextColor }, // Use table header color base
                    uniqueBoxes: { background: alpha('#e57373', 0.2), text: '#e57373' }, // Light Red base
                    avgReading: { background: alpha('#81c784', 0.2), text: '#81c784' }, // Light Green base
                    minReading: { background: alpha('#ffb74d', 0.2), text: '#ffb74d' }, // Light Orange base
                    maxReading: { background: alpha('#64b5f6', 0.2), text: '#64b5f6' }, // Light Blue base
                },
                // You might want specific primary/secondary for dark mode too
                // primary: { main: '#bb86fc' },
                // secondary: { main: '#03dac6' },
            }
            : {
                // Light mode palette values
                background: {
                    default: '#eaeaea', // Light page background
                    paper: lightPrimaryBackgroundColor,
                },
                text: {
                    primary: lightPrimaryTextColor,
                    secondary: lightSecondaryTextColor,
                    disabled: lightDisabledTextColor,
                },
                divider: lightDividerColor,
                customBackground: {
                    main: lightPrimaryBackgroundColor,
                    secondary: lightSecondaryBackgroundColor,
                },
                customText: {
                    main: lightPrimaryTextColor,
                    secondary: lightSecondaryTextColor,
                    tableHeader: lightTableHeaderTextColor,
                    tableCell: lightTableCellTextColor,
                    disabled: lightDisabledTextColor,
                },
                customAction: {
                    hoverBackground: lightHoverBackgroundColor,
                    selectedBackground: lightSelectedBackgroundColor,
                },
                customBorder: {
                    main: lightSecondaryTextColor,
                    disabled: lightDisabledBorderColor,
                },
                customChart: {
                    background: lightPrimaryBackgroundColor,
                    text: lightPrimaryTextColor,
                    gridLines: lightChartGridColor,
                },
                stats: { // Define stats colors for light mode
                    totalReadings: { background: alpha(lightTableHeaderTextColor, 0.1), text: lightTableHeaderTextColor }, // Use table header color base
                    uniqueBoxes: { background: alpha('#d32f2f', 0.1), text: '#d32f2f' }, // Dark Red base
                    avgReading: { background: alpha('#388e3c', 0.1), text: '#388e3c' }, // Dark Green base
                    minReading: { background: alpha('#f57c00', 0.1), text: '#f57c00' }, // Dark Orange base
                    maxReading: { background: alpha('#1976d2', 0.1), text: '#1976d2' }, // Dark Blue base
                },
                // Define primary/secondary for light mode if needed
                // primary: { main: '#6200ee' },
                // secondary: { main: '#03dac6' }, // Often same as dark
            }),
    },
    // You can also define mode-specific typography, components overrides etc. here
});