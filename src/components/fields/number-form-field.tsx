import { Input } from '@nextui-org/react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

type TInputField<TFieldValues extends FieldValues> = {
  label: string;
  error?: FieldError;
  name: Path<TFieldValues>;
  control: Control<TFieldValues, unknown>;
  disabled?: boolean;
  suffix?: string;
  prefix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
};

export default function NumberFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  suffix,
  disabled,
  decimalScale,
  fixedDecimalScale,
  prefix,
}: TInputField<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <NumericFormat
            disabled={disabled}
            suffix={suffix}
            prefix={prefix}
            value={value || ''}
            label={label}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            decimalSeparator=","
            error={!!error}
            helperText={error ? error?.message : ''}
            onValueChange={(values) => onChange(values.floatValue)}
            customInput={Input}
          />
        );
      }}
    />
  );
}
