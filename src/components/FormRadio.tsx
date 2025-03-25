import type { FormFieldComponent, RadioField } from "@/constants/webRouteForm";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import Popup from "container/Popup";
import { RadioGroup, RadioGroupItem } from "container/Radio";
import { CircleHelp } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

const FormRadio: FC<FormFieldComponent<RadioField>> = ({
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
				<RadioGroup
					onValueChange={field.onChange}
					defaultValue={field.value}
					className="flex radio-group mt-2"
				>
					{fieldInfo.options.map((item) => (
						<FormItem
							key={item.text}
							className="flex flex-row items-center space-x-3 space-y-0 gap-2"
						>
							<FormControl>
								<RadioGroupItem value={item.value} />
							</FormControl>
							<FormLabel className="font-normal">{t(item.text)}</FormLabel>
						</FormItem>
					))}
				</RadioGroup>
			</FormControl>
			{fieldInfo.description && (
				<FormDescription>{t(fieldInfo.description)}</FormDescription>
			)}
			{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
		</FormItem>
	);
};

export default FormRadio;
