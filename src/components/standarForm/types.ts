export interface FormField {
  id?: number;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
}

export interface StandardFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: unknown) => void;
  submitButtonText?: string;
  initialValues?: Record<string, unknown>;
}
