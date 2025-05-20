import type {
	ComboboxField,
	FormFieldComponent,
} from "@/constants/webRouteForm";
import { Combobox } from "container/Combobox";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const FormCombobox: FC<FormFieldComponent<ComboboxField>> = ({
	fieldInfo,
	field,
	error,
}) => {
	const { t } = useTranslation();

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
			<FormControl>
				<Combobox
					value={field.value}
					onValueChange={field.onChange}
					options={fieldInfo.options}
					placeholder={fieldInfo.placeholder.map((value) => t(value)).join(" ")}
				/>
			</FormControl>
			{fieldInfo.description && (
				<FormDescription>{t(fieldInfo.description)}</FormDescription>
			)}
			{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
		</FormItem>
	);
};

export default FormCombobox;
