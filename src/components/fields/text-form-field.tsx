import { cn } from '@/utils/cn';
import { Input } from '@nextui-org/react';
import { HTMLProps } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

type TInputField<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues, unknown>;
  error?: FieldError;
  disabled?: boolean;
  className?: HTMLProps<HTMLElement>['className'];
};

export default function TextFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  disabled,
  className,
}: TInputField<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Input
          className={cn(className)}
          variant="filled"
          disabled={disabled}
          label={label}
          value={value || null}
          isInvalid={!!error}
          errorMessage={error ? error?.message : ''}
          onValueChange={(value: string) => onChange(value)}
        />
      )}
    />
  );
}
