import { SampleData } from "@/type"
import { TableCell, TableHead, TableRow, styled } from "@mui/material"
import { flexRender, HeaderGroup } from "@tanstack/react-table"

interface TableHeaderComponentProps {
    headerGroups: HeaderGroup<SampleData>[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.customText.tableHeader,
    fontWeight: "bold",
    padding: theme.spacing(1),
    textAlign: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&:hover": {
        backgroundColor: theme.palette.customAction.hoverBackground,
    },
}));


const TableHeaderComponent = ({ headerGroups }: TableHeaderComponentProps) => {

    return (
        <TableHead>
            {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <StyledTableCell
                            key={header.id}
                            onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                            colSpan={header.colSpan}
                            sx={{
                                width: header.getSize(),
                                position: header.column.getIsResizing() ? "relative" : "static",
                            }}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                                asc: " 🔼",
                                desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                        </StyledTableCell>
                    ))}
                </TableRow>
            ))}
        </TableHead>
    )
}

export default TableHeaderComponent