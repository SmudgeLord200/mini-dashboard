import { StyledDataTableRow, StyledDataTableCell } from "@/StyledComponents";
import { SampleData } from "@/type";
import { flexRender, Row } from "@tanstack/react-table";

interface TableRowComponentProps {
    rows: Row<SampleData>[];
}

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
