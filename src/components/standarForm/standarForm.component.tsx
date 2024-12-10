import React from 'react';
import { Formik, Form } from 'formik';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box
} from '@mui/material';
import { FormFieldComponent } from './formField.component';
import { StandardFormProps } from './types';

export const StandardForm: React.FC<StandardFormProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonText = 'Guardar',
  initialValues = {}
}) => {
  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = initialValues[field.name] || '';
    return acc;
  }, {} as Record<string, unknown>);

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center',
    }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
          {title}
        </Typography>
        <Formik
          initialValues={defaultValues}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Grid container spacing={2}
               direction="column" 
               sx={{ maxWidth: '500px', width: '100%' }}
              > 
                {fields.map((field) => (
                  <FormFieldComponent 
                    key={field.name} 
                    field={field} 
                  />
                ))}
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                >
                  {submitButtonText}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};