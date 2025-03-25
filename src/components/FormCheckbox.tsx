import type {
	CheckboxField,
	FormFieldComponent,
} from "@/constants/webRouteForm";
import { Checkbox } from "container/Checkbox";
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

const FormCheckbox: FC<FormFieldComponent<CheckboxField>> = ({
	fieldInfo,
	field,
	error,
}) => {
	const { t } = useTranslation();

	return (
		<FormItem>
			<div className="flex flex-row items-center gap-2">
				<FormControl>
					<Checkbox checked={field.value} onCheckedChange={field.onChange} />
				</FormControl>
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
			</div>
			{fieldInfo.description && (
				<FormDescription>{t(fieldInfo.description)}</FormDescription>
			)}
			{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
		</FormItem>
	);
};

export default FormCheckbox;
