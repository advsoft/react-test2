import * as React from "react"
import type { FieldPath, FieldValues } from "react-hook-form"
import { useFormContext } from "react-hook-form"

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

export const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export type FormItemContextValue = {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext?.name) {
    return { id: "", name: "", formItemId: "", formDescriptionId: "", formMessageId: "", error: undefined };
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const itemId = itemContext?.id ?? "";

  return {
    id: itemId,
    name: fieldContext.name,
    formItemId: `${itemId}-form-item`,
    formDescriptionId: `${itemId}-form-item-description`,
    formMessageId: `${itemId}-form-item-message`,
    ...fieldState,
  }
}
