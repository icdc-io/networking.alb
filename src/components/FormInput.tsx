import type { FormFieldComponent, InputField } from "@/constants/webRouteForm";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Input } from "container/Input";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const FormInput: FC<FormFieldComponent<InputField>> = ({
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
				<Input
					placeholder={fieldInfo.placeholder.map((value) => t(value)).join(" ")}
					{...field}
					value={String(field.value)}
				/>
			</FormControl>
			{fieldInfo.description && (
				<FormDescription>{t(fieldInfo.description)}</FormDescription>
			)}
			{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
		</FormItem>
	);
};

export default FormInput;
