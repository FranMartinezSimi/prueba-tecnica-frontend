import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridPaginationModel, GridRowModel, GridValidRowModel, GridRowSelectionModel, GridCallbackDetails } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface DataGridComponentProps {
  columns: GridColDef[];
  rows: unknown[];
  loading?: boolean;
  pageSize?: number;
  checkboxSelection?: boolean;
  onPageChange?: (model: GridPaginationModel) => void;
  onRowSelectionChange?: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void;
  processRowUpdate?: (newRow: GridRowModel) => Promise<GridRowModel>;
  onDeleteRow?: (id: number | string) => void;
}

export const DataGridComponent: React.FC<DataGridComponentProps> = ({
  columns,
  rows,
  loading = false,
  pageSize = 10,
  checkboxSelection = true,
  onPageChange,
  onRowSelectionChange,
  processRowUpdate,
  onDeleteRow
}) => {
  const columnsWithDelete = React.useMemo(() => {
    if (!checkboxSelection || !onDeleteRow) return columns;
    
    return [
      ...columns,
      {
        field: 'actions',
        headerName: 'Acciones',
        width: 100,
        renderCell: (params) => (
          <IconButton
            onClick={() => onDeleteRow(params.row.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ];
  }, [columns, checkboxSelection, onDeleteRow]);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows as GridValidRowModel[]}
        columns={columnsWithDelete}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 100]}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        onPaginationModelChange={onPageChange}
        onRowSelectionModelChange={onRowSelectionChange}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
};