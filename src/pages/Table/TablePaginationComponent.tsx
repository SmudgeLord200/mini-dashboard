import { StyledPaginationStack, StyledPaginationButton, StyledPaginationText, StyledGoToPageTextField, StyledRowsPerPageFormControl, StyledRowsPerPageInputLabel, StyledRowsPerPageSelect } from "@/StyledComponents";
import { SampleData } from "@/type";
import { MenuItem } from "@mui/material"; 
import { Row, Table } from "@tanstack/react-table";

interface TablePaginationComponentProps {
    table: Table<SampleData>
    rows: Row<SampleData>[]
}

const TablePaginationComponent = ({ table, rows }: TablePaginationComponentProps) => {

    const isDisabled = rows.length === 0; 

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
                inputProps={{ min: 1, max: table.getPageCount() || 1 }} 
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    const validatedPage = Math.max(0, Math.min(page, table.getPageCount() - 1));
                    table.setPageIndex(validatedPage);
                    if (page !== validatedPage) {
                        e.target.value = (validatedPage + 1).toString();
                    }
                }}
                variant="outlined"
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
                    MenuProps={{ 
                        PaperProps: {
                            sx: {
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