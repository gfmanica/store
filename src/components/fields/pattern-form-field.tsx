import { Input } from '@nextui-org/react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';
import {
  NumberFormatValues,
  NumericFormat,
  PatternFormat,
} from 'react-number-format';

type TInputField<TFieldValues extends FieldValues> = {
  label?: string;
  error?: FieldError;
  name: Path<TFieldValues>;
  control: Control<TFieldValues, unknown>;
  disabled?: boolean;
  suffix?: string;
  prefix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  valueFormat?: 'floatValue' | 'value';
  size?: 'sm' | 'md' | 'lg';
  format: string;
  allowEmptyFormatting?: boolean;
  mask?: string;
  type?: 'normal' | 'date';
  onChangeCallback?: (value: number) => void;
};

export default function PatternFormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  suffix,
  disabled,
  decimalScale,
  fixedDecimalScale,
  prefix,
  size = 'md',
  type = 'date',
  onChangeCallback,
  format,
  allowEmptyFormatting,
  mask,
}: TInputField<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <PatternFormat
            disabled={disabled}
            suffix={suffix}
            prefix={prefix}
            format={format}
            allowEmptyFormatting={allowEmptyFormatting}
            mask={mask}
            value={value ?? ''}
            label={label}
            size={size}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            decimalSeparator=","
            error={!!error}
            helperText={error ? error?.message : ''}
            onValueChange={(values) => {
              const { formattedValue } = values;

              onChange(formattedValue);
            }}
            customInput={Input}
          />
        );
      }}
    />
  );
}
