import { useFetch } from "../hooks/useFetch";
import { DataGridComponent } from '../components/table.component';
import { Box, CircularProgress, Snackbar, Alert, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { GridRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { usePutFetch } from "../hooks/putFetch";
import { useDeleteFetch } from "../hooks/deleteFetch";
import { DeleteRounded } from "@mui/icons-material";
import { usePostFetch } from "../hooks/postFetch";
import { StandardForm } from "../components/standarForm/standarForm.component";


interface ApiResponse {
    status: string;
    message: string;
    data: Brand[];
    statusCode: number;
}

export interface Brand {
    id: number;
    name: string;
    logo?: string;
}

interface BrandFormData {
    name: string;
    logo?: string;
}

const Brands = () => {
    const { data: response, loading: fetchLoading, error: fetchError, refetch } = useFetch<ApiResponse>("/brands");
    const { updateData, loading: updateLoading, error: updateError } = usePutFetch<Brand>();
    const { createData, loading: createLoading, error: createError } = usePostFetch<Brand>("/brands");
    const { deleteData, loading: deleteLoading, error: deleteError } = useDeleteFetch<Brand>("/brands");
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const [rows, setRows] = useState<Brand[]>([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        if (response?.data) {
            setRows(response.data);
        }
    }, [response]);

    const handleCreateBrand = async (data: BrandFormData) => {
        try {
            await createData(data);
            refetch();
            setSnackbar({
                open: true,
                message: 'Marca creada con éxito',
                severity: 'success'
            });
        } catch (error: unknown) {
            setSnackbar({
                open: true,
                message: 'Error al crear la marca',
                severity: 'error'
            });
            console.error('Error al crear la marca:', error);
        }
    };

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

    useEffect(() => {
        if (fetchError || updateError || deleteError || createError) {
            setSnackbar({
                open: true,
                message: fetchError || updateError || deleteError || createError || 'Error en la operación',
                severity: 'error'
            });
        }
    }, [fetchError, updateError, deleteError, createError]);

    if (fetchLoading || updateLoading || createLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
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
                        field: 'name',
                        headerName: 'Nombre',
                        width: 300,
                        editable: true,
                    },
                    {
                        field: 'logo',
                        headerName: 'Logo',
                        width: 150,
                        editable: true,
                        renderCell: (params) => (
                            params.value ? (
                                <img 
                                    src={params.value} 
                                    alt={`Logo de ${params.row.name}`}
                                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                                />
                            ) : 'Sin logo'
                        )  
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
                }}            
            />
            <StandardForm
                title="Crear Nueva Marca"
                fields={[
                    {
                        name: 'name',
                        label: 'Nombre de la Marca',
                        required: true
                    },
                    {
                        name: 'logo',
                        label: 'URL del Logo',
                        required: false
                    }
                ]}
                onSubmit={(data: unknown) => handleCreateBrand(data as BrandFormData)}
                submitButtonText="Crear Marca"
            />

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

export default Brands;