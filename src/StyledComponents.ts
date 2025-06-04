import { styled, Paper, Container, Typography, Box, FormControl, Stack, TableCell, Button, InputLabel, Select, TextField, TableRow } from "@mui/material";

// Chart
export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.customChart?.background,
    color: theme.palette.customChart?.text,
    padding: theme.spacing(2),
    textAlign: 'center',
    display: "flex",
    height: '100%', 
}));

export const ChartContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

export const ChartPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.customChart.background, 
}));

export const ChartTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.customChart.text,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
}));

export const FilterStack = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center'
}));

export const FilterFormControl = styled(FormControl)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper, 
    minWidth: 200,
    '& .MuiInputBase-root': { 
        color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root': { 
        color: theme.palette.text.secondary,
    },
}));

export const ChipBox = styled(Box)({ 
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
});

export const EmptyStateTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export const LoadingStack = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(4),
    alignItems: 'center',
    spacing: 1,
    color: theme.palette.text.secondary, 
}));


export const StatisticRowValue = styled(Typography)(({}) => ({
    fontWeight: 'bold',
    fontSize: '1.5rem',
}));


// Table
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.customText.tableHeader,
    fontWeight: "bold",
    padding: theme.spacing(1),
    textAlign: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&:hover": {
        backgroundColor: theme.palette.customAction.hoverBackground,
    },
}));

export const StyledPaginationStack = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2), 
    marginTop: theme.spacing(1), 
}));

export const StyledPaginationButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary, 
    borderColor: theme.palette.customBorder.main, 
    '&:hover': {
        borderColor: theme.palette.text.primary, 
        backgroundColor: theme.palette.customAction.hoverBackground, 
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled, 
        borderColor: theme.palette.customBorder.disabled, 
    },
    minWidth: '40px', 
    padding: theme.spacing(0.5, 1),
}));

export const StyledPaginationText = styled(Typography)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    color: theme.palette.text.primary, 
    '& strong': { 
        color: theme.palette.text.primary, 
    }
}));

export const StyledGoToPageTextField = styled(TextField)(({ theme }) => ({
    '& label': {
        color: theme.palette.text.secondary, 
    },
    '& label.Mui-focused': {
        color: theme.palette.text.primary, 
    },
    '& .MuiOutlinedInput-root': {
        color: theme.palette.text.primary, 
        '& fieldset': {
            borderColor: theme.palette.customBorder.main,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.text.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.text.primary, 
        },
        '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            '& fieldset': {
                borderColor: theme.palette.customBorder.disabled,
            }
        },
        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none', 
            margin: 0,
        },
        '& input[type=number]': {
            MozAppearance: 'textfield', 
            textAlign: 'center', 
            padding: theme.spacing(1),
        },
    },
    width: "70px", 
}));

export const StyledRowsPerPageFormControl = styled(FormControl)(({}) => ({
    minWidth: 120, 
}));


export const StyledRowsPerPageInputLabel = styled(InputLabel)(({ theme }) => ({
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
        color: theme.palette.text.primary, 
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled, 
    },
}));

export const StyledRowsPerPageSelect = styled(Select)(({ theme }) => ({
    color: theme.palette.text.primary, 
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.customBorder.main, 
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.primary, 
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.primary, 
    },
    '& .MuiSvgIcon-root': { 
        color: theme.palette.text.primary,
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled,
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.customBorder.disabled,
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.text.disabled,
        },
    },
    '.MuiSelect-select': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    }
}));

export const StyledDataTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.customAction.hoverBackground,
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child td, &:last-child th': { 
        borderBottom: 0,
    },
}));

export const StyledDataTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.customText.tableCell,
    borderBottomColor: theme.palette.divider,
    padding: theme.spacing(1, 2), 
    textAlign: "left", 
}));