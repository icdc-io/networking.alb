import type { FormFieldComponent, SelectField } from "@/constants/webRouteForm";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import Popup from "container/Popup";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { CircleHelp } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const FormSelect: FC<FormFieldComponent<SelectField>> = ({
	fieldInfo,
	field,
	error,
}) => {
	const { t } = useTranslation();

	// const queryCLient = useQueryClient();
	// queryCLient.getQueryData([getAppId(window.location.pathname), ], )
	const onChangeToNumber = (value: string) => field.onChange(+value);

	const triggerProps = fieldInfo.isClearable
		? {
				onClear: fieldInfo.isClearable ? () => field.onChange("") : undefined,
				value: field.value,
			}
		: {};

	return (
		<FormItem>
			<FormLabel className="flex items-center">
				<b>{fieldInfo.label.map((value) => t(value)).join("")}</b>&nbsp;
				{fieldInfo.clarification && (
					<Popup content={t(fieldInfo.clarification)}>
						<button type="button">
							<CircleHelp size={16} />
						</button>
					</Popup>
				)}
			</FormLabel>
			<Select
				onValueChange={field.onChange}
				value={field.value}
				// disabled={!isSuccess}
			>
				<FormControl>
					<SelectTrigger {...triggerProps} disabled={fieldInfo.disabled}>
						<SelectValue placeholder={t(fieldInfo.placeholder)} />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					{fieldInfo.options.map((option) => (
						<SelectItem key={option.text} value={option.value}>
							{option.text}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{fieldInfo.description && (
				<FormDescription>{t(fieldInfo.description)}</FormDescription>
			)}
			{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
		</FormItem>
	);
};

export default FormSelect;
