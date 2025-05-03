import { SampleData } from "@/type";
import { Stack, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, styled } from "@mui/material"; // Added styled
import { Row, Table } from "@tanstack/react-table";

// --- Styled Components ---
const StyledPaginationStack = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2), // Add some padding around the pagination controls
    marginTop: theme.spacing(1), // Ensure some space above the pagination
}));

const StyledPaginationButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary, // Use primary text color from theme
    borderColor: theme.palette.customBorder.main, // Use custom border color
    '&:hover': {
        borderColor: theme.palette.text.primary, // Use primary text color for hover border
        backgroundColor: theme.palette.customAction.hoverBackground, // Use custom hover background
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled, // Use disabled text color
        borderColor: theme.palette.customBorder.disabled, // Use disabled border color
    },
    minWidth: '40px', // Ensure buttons have a minimum width
    padding: theme.spacing(0.5, 1), // Adjust padding for better size
}));

const StyledPaginationText = styled(Typography)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5), // Use theme spacing for gap
    color: theme.palette.text.primary, // Use primary text color
    '& strong': { // Style the bold part specifically if needed
        color: theme.palette.text.primary, // Or a different color like customText.tableHeader
    }
}));

const StyledGoToPageTextField = styled(TextField)(({ theme }) => ({
    '& label': {
        color: theme.palette.text.secondary, // Use secondary text color for label
    },
    '& label.Mui-focused': {
        color: theme.palette.text.primary, // Use primary text color for focused label
    },
    '& .MuiOutlinedInput-root': {
        color: theme.palette.text.primary, // Input text color
        '& fieldset': {
            borderColor: theme.palette.customBorder.main, // Use custom border color
        },
        '&:hover fieldset': {
            borderColor: theme.palette.text.primary, // Use primary text color for hover border
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.text.primary, // Use primary text color for focused border
        },
        // Style for disabled state
        '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            '& fieldset': {
                borderColor: theme.palette.customBorder.disabled,
            }
        },
        // Adjust input type=number arrows
        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
            WebkitAppearance: 'none', // Use camelCase for JS style objects
            margin: 0,
        },
        '& input[type=number]': {
            MozAppearance: 'textfield', // Use camelCase for JS style objects (Firefox)
            textAlign: 'center', // Center the number input
            padding: theme.spacing(1), // Adjust padding
        },
    },
    width: "70px", // Slightly wider for better appearance
    // Remove size="small" if padding is handled within styles
}));

const StyledRowsPerPageFormControl = styled(FormControl)(({}) => ({
    minWidth: 120, // Give the control a minimum width
}));


const StyledRowsPerPageInputLabel = styled(InputLabel)(({ theme }) => ({
    color: theme.palette.text.secondary, // Use secondary text color
    '&.Mui-focused': {
        color: theme.palette.text.primary, // Use primary text color when focused
    },
    '&.Mui-disabled': {
        color: theme.palette.text.disabled, // Use disabled text color
    },
}));

const StyledRowsPerPageSelect = styled(Select)(({ theme }) => ({
    color: theme.palette.text.primary, // Text color of the selected value
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.customBorder.main, // Use custom border color
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.primary, // Use primary text color for hover border
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.text.primary, // Use primary text color for focused border
    },
    '& .MuiSvgIcon-root': { // Style dropdown arrow
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
    // Adjust padding if needed, especially if size="small" is removed from FormControl
    '.MuiSelect-select': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    }
}));

// --- Component ---
interface TablePaginationComponentProps {
    table: Table<SampleData>
    rows: Row<SampleData>[]
}

const TablePaginationComponent = ({ table, rows }: TablePaginationComponentProps) => {

    const isDisabled = rows.length === 0; // Determine disabled state once

    return (
        // Use the styled Stack
        <StyledPaginationStack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
            <StyledPaginationButton
                variant="outlined"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage() || isDisabled}
            >
                {"<<"}
            </StyledPaginationButton>
            <StyledPaginationButton
                variant="outlined"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || isDisabled}
                aria-label="previous page"
            >
                {"<"}
            </StyledPaginationButton>
            <StyledPaginationButton
                variant="outlined"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || isDisabled}
                aria-label="next page"
            >
                {">"}
            </StyledPaginationButton>
            <StyledPaginationButton
                variant="outlined"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage() || isDisabled}
            >
                {">>"}
            </StyledPaginationButton>

            <StyledPaginationText variant="body2" as="span">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </StyledPaginationText>

            <StyledPaginationText variant="body2" as="span">
                | Go to page:
            </StyledPaginationText>
        
            <StyledGoToPageTextField
                type="number"
                inputProps={{ min: 1, max: table.getPageCount() || 1 }} // Ensure max is at least 1
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    // Add validation to prevent going beyond bounds
                    const validatedPage = Math.max(0, Math.min(page, table.getPageCount() - 1));
                    table.setPageIndex(validatedPage);
                    // Optional: Update input value if validation changed it
                    if (page !== validatedPage) {
                        e.target.value = (validatedPage + 1).toString();
                    }
                }}
                variant="outlined"
                // size="small" // Removed, handled by styles
                disabled={isDisabled}
            />

            <StyledRowsPerPageFormControl variant="outlined" size="small" disabled={isDisabled}>
                <StyledRowsPerPageInputLabel>Rows per page</StyledRowsPerPageInputLabel>
                <StyledRowsPerPageSelect
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    label="Rows per page"
                    aria-label="Rows per page"
                    // disabled prop is inherited from FormControl
                    MenuProps={{ // Keep MenuProps for dropdown styling
                        PaperProps: {
                            sx: {
                                // Use theme variables for dropdown menu
                                backgroundColor: (theme) => theme.palette.customBackground.secondary,
                                color: (theme) => theme.palette.text.primary,
                                '& .MuiMenuItem-root:hover': {
                                    backgroundColor: (theme) => theme.palette.customAction.hoverBackground,
                                },
                                '& .Mui-selected': {
                                    backgroundColor: (theme) => `${theme.palette.customAction.selectedBackground} !important`, // Use important if needed
                                }
                            },
                        },
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <MenuItem key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </MenuItem>
                    ))}
                </StyledRowsPerPageSelect>
            </StyledRowsPerPageFormControl>
        </StyledPaginationStack>
    )
}

export default TablePaginationComponent;