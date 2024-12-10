import React from 'react';
import { Field, FieldInputProps } from 'formik';
import { TextField, MenuItem, Grid } from '@mui/material';
import { FormField } from './types';

  
interface FormFieldProps {
  field: FormField;
}

export const FormFieldComponent: React.FC<FormFieldProps> = ({ field }) => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Field name={field.name}>
        {({ field: formikField }: { field: unknown }) => (
          field.type === 'select' ? (
            <TextField
              {...(formikField as unknown as FieldInputProps<string>)}
              select
              fullWidth
              label={field.label}
              required={field.required}
              variant="outlined"
            >
              {field.options?.map((option: { value: string; label: string }) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              {...(formikField as unknown as FieldInputProps<string>)}
              fullWidth
              label={field.label}
              type={field.type || 'text'}
              required={field.required}
              variant="outlined"
              multiline={field.multiline}
              rows={field.rows}
            />
          )
        )}
      </Field>
    </Grid>
  );
};