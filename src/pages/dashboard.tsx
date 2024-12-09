import { useFetch } from "../hooks/useFetch";
import { DataGridComponent } from '../components/table.component';
import { Box, CircularProgress, Snackbar, Alert, IconButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { GridRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { usePutFetch } from "../hooks/putFetch";
import { useDeleteFetch } from "../hooks/deleteFetch";
import { DeleteRounded } from "@mui/icons-material";
import { Perfume } from "./perfumes";

interface ApiResponse {
    status: string;
    message: string;
    data: Inventory[];
    statusCode: number;
}

export interface Inventory {
  id: number;
  size: '50' | '100' | '200';
  perfume: Perfume;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
    const { data: response, loading: fetchLoading, error: fetchError } = useFetch<ApiResponse>("/inventory");
    const { updateData, loading: updateLoading, error: updateError } = usePutFetch<Inventory>();
    const [rows, setRows] = useState<Inventory[]>([]);
    const { deleteData, loading: deleteLoading, error: deleteError } = useDeleteFetch<Inventory>("/inventory");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    console.log(response?.data);
    useEffect(() => {
        if (response?.data) {
            setRows(response.data);
        }
    }, [response]);

    const handleProcessRowUpdate = async (newRow: GridRowModel) => {
        try {
            const updatedBrand = await updateData(newRow.id, newRow);
            
            setRows((prevRows) => 
                prevRows.map((row) => (row.id === updatedBrand.id ? updatedBrand : row))
            );

            setSnackbar({
                open: true,
                message: 'Marca actualizada con éxito',
                severity: 'success'
            });

            return updatedBrand;
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al actualizar la marca',
                severity: 'error'
            });
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            if (deleteLoading) return;

            const deleteBrand = await deleteData(id);
            if (deleteBrand) {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
                setSnackbar({
                    open: true,
                    message: 'Marca eliminada con éxito',
                    severity: 'success'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al eliminar la marca',
                severity: 'error'
            });
            console.error('Error al eliminar la marca:', error);
        }
    };


    if (fetchLoading || updateLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );
    
    if (fetchError || updateError || deleteError) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h6" color="error">Error: {fetchError || updateError || deleteError}</Typography>
        </Box>
    );

    if (!response?.data || !Array.isArray(response.data)) {
        return <div>No hay datos disponibles</div>;
    }
    
    return (
        <Box>
            <DataGridComponent
                columns={[
                    {
                        field: 'id',
                        headerName: 'ID',
                        width: 90
                    },
                    {
                        field: 'size',
                        headerName: 'Tamaño',
                        width: 100,
                        editable: true,
                    },
                    {
                        field: 'perfume',
                        headerName: 'Perfume',
                        width: 200,
                        editable: true,
                        renderCell: (params) => (
                            params.value ? (
                                <Typography>{params.value.name}</Typography>
                            ) : null
                        )  
                    },
                    {
                        field: 'brand',
                        headerName: 'Marca',
                        width: 250,
                        editable: true,
                        renderCell: (params) => (
                            params.value ? (
                                <Typography>{params.value.name}</Typography>
                            ) : null
                        )
                    },
                    {
                        field: 'price',
                        headerName: 'Precio',
                        width: 100,
                        editable: true,
                    },
                    {
                        field: 'stock',
                        headerName: 'Stock',
                        width: 100,
                        editable: true,
                    },
                    {
                        field: 'eliminar',
                        headerName: 'Eliminar',
                        width: 100,
                        renderCell: (params) => (
                            selectedRows.includes(params.row.id) ? (
                                <IconButton onClick={() => handleDelete(params.row.id)} color="error" size="small">
                                    <DeleteRounded />
                                </IconButton>
                            ) : null
                        )
                    }       
                ]}
                rows={rows}
                processRowUpdate={handleProcessRowUpdate}
                checkboxSelection
                onRowSelectionChange={(newSelection: GridRowSelectionModel) => {
                    setSelectedRows(newSelection as number[]);
                }}            />

            <Snackbar 
                open={snackbar.open}
                autoHideDuration={6000} 
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert 
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Dashboard;