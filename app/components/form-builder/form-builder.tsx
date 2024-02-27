import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export type TInputField = {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: React.HTMLInputTypeAttribute;
};

function FormBuilder<T extends FieldValues>({
  form,
  fields,
}: {
  form: UseFormReturn<T>;
  fields: TInputField[];
}) {
  return (
    <>
      {fields.map((field) => {
        const {
          label,
          name,
          placeholder,
          required = false,
          type = "text",
        } = field;
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    {...field}
                  />
                </FormControl>{" "}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
}

export default FormBuilder;
