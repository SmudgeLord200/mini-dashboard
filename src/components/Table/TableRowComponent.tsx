import { SampleData } from "@/type";
import { TableCell, TableRow, styled } from "@mui/material"; // Import styled
import { flexRender, Row } from "@tanstack/react-table";

interface TableRowComponentProps {
    rows: Row<SampleData>[];
}

// --- Styled Components ---
const StyledDataTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        // Use the custom hover background defined in the theme
        backgroundColor: theme.palette.customAction.hoverBackground,
    },
    // Optional: Add striping for better readability
    '&:nth-of-type(odd)': {
        // Slightly different background for odd rows, if desired
        // backgroundColor: alpha(theme.palette.background.paper, 0.5), // Example
    },
    // Ensure borders are consistent
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child td, &:last-child th': { // Remove border from last row cells
        borderBottom: 0,
    },
}));

const StyledDataTableCell = styled(TableCell)(({ theme }) => ({
    // Use the custom text color for table cells
    color: theme.palette.customText.tableCell,
    // Use the standard divider color for the bottom border
    borderBottomColor: theme.palette.divider,
    padding: theme.spacing(1, 2), // Adjust padding as needed (vertical, horizontal)
    textAlign: "left", // Default alignment for data cells
}));


// --- Component ---
const TableRowComponent = ({ rows }: TableRowComponentProps) => {
    return (
        rows.map((row) => (
            <StyledDataTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    <StyledDataTableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </StyledDataTableCell>
                ))}
            </StyledDataTableRow>
        ))
    );
};

export default TableRowComponent;
