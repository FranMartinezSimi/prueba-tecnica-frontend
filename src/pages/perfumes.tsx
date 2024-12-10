import { useFetch } from "../hooks/useFetch";
import { DataGridComponent } from '../components/table.component';
import { Box, CircularProgress, Snackbar, Alert, IconButton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { GridRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { usePutFetch } from "../hooks/putFetch";
import { useDeleteFetch } from "../hooks/deleteFetch";
import { DeleteRounded } from "@mui/icons-material";
import { Brand } from "./brands";
import { StandardForm } from "../components/standarForm/standarForm.component";
import { usePostFetch } from "../hooks/postFetch";
import { AxiosError } from "axios";


interface ApiResponse {
    status: string;
    message: string;
    data: Perfume[];
    statusCode: number;
}

export interface Perfume {
    id: number;
    name: string;
    brand: Brand;
    description: string;
    logo?: string;
}

interface PerfumeFormData {
    id: number;
    name: string;
    brandId: number;
    description: string;
    imageUrl?: string;
}

const Perfumes = () => {
    const { data: response, loading: fetchLoading, error: fetchError, refetch } = useFetch<ApiResponse>("/perfumes");
    const { data: brandsResponse } = useFetch<ApiResponse>("/brands");
    const { updateData, loading: updateLoading, error: updateError } = usePutFetch<Perfume>();
    const { deleteData, loading: deleteLoading, error: deleteError } = useDeleteFetch<Perfume>("/perfumes");
    const { createData, loading: createLoading, error: createError } = usePostFetch<Perfume>("/perfumes");
    const [rows, setRows] = useState<Perfume[]>([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    useEffect(() => {
        if (response?.data) {
            setRows(response.data);
        }
    }, [response]);

    const handleCreatePerfume = async (data: PerfumeFormData) => {
        const perfumeData = {
            name: data.name,
            brandId: parseInt(data.brandId as unknown as string),
            description: data.description,
            imageUrl: data.imageUrl || null
        };
        try {
            await createData(perfumeData);
            refetch();
            setSnackbar({
                open: true,
                message: 'Perfume creado con éxito',
                severity: 'success'
            })
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al crear el perfume',
                severity: 'error'
            });
            console.error('Error al crear el perfume:', error);
        }
    }
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
            refetch();

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
        if (deleteLoading) return;
        try {
            await deleteData(id);
            setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            setSnackbar({
                open: true,
                message: 'Perfume eliminado con éxito',
                severity: 'success'
            });
        } catch (error: unknown) {
            console.log(error);
            const errorMessage = (error as AxiosError).status== 400
                ? 'No se puede eliminar el perfume porque tiene dependencias asociadas'
                : 'Error al eliminar el perfume';
                
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            console.error('Error al eliminar el perfume:', error);
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
                        field: 'description',
                        headerName: 'Descripción',
                        width: 450,
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
                pageSize={10}
                rows={rows}
                processRowUpdate={handleProcessRowUpdate}
                checkboxSelection
                onRowSelectionChange={(newSelection: GridRowSelectionModel) => {
                    setSelectedRows(newSelection as number[]);
                }}           
            />
            <StandardForm
                title="Crear Nuevo Perfume"
                fields={[
                    {
                        name: 'name',
                        label: 'Nombre del Perfume',
                        required: true
                    },
                    {
                        name: 'brandId',
                        label: 'Marca',
                        type: 'select',
                        required: true,
                        options: brandsResponse?.data?.map(brand => ({
                            value: brand.id.toString(),
                            label: brand.name
                        })) || []
                    },
                    {
                        name: 'description',
                        label: 'Descripción',
                        required: true
                    },
                    {
                        name: 'imageUrl',
                        label: 'URL de la Imagen',
                        required: false
                    }
                ]}
                onSubmit={(data: unknown) => handleCreatePerfume(data as PerfumeFormData)}
                submitButtonText="Crear Perfume"
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

export default Perfumes;
