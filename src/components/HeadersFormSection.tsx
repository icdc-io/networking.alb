import type { WebRouteFormSchema } from "@/schemas/WebRouteFormSchema";
import { Button } from "container/Button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	type UseFormReturn,
	useFieldArray,
} from "container/Form";
import { Input } from "container/Input";
import Popup from "container/Popup";
import { CircleHelp, Trash2 } from "lucide-react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type HeadersFormSection = {
	form: UseFormReturn<z.infer<typeof WebRouteFormSchema>>;
};

const HeadersFormSection: FC<HeadersFormSection> = ({ form }) => {
	const { t } = useTranslation();

	const {
		fields: headers,
		append: appendHeader,
		remove: removeHeader,
	} = useFieldArray({
		name: "healthcheck.headers",
		control: form.control,
	});

	return (
		<>
			<FormLabel className="flex items-center">
				<b>
					{t("headers")} {t("options")}
				</b>
				&nbsp;
				<Popup content={t("tooltipHeaders")}>
					<button type="button">
						<CircleHelp size={16} />
					</button>
				</Popup>
			</FormLabel>
			{headers.map((header, index) => {
				return (
					<div className="flex gap-2" key={header.id}>
						<FormField
							control={form.control}
							name={`healthcheck.headers.${index}.name`}
							render={({ field }) => {
								return (
									<FormItem>
										<FormControl>
											<Input {...field} value={String(field.value)} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							key={header.id}
							control={form.control}
							name={`healthcheck.headers.${index}.value`}
							render={({ field }) => {
								return (
									<FormItem>
										<FormControl>
											<Input {...field} value={String(field.value)} />
										</FormControl>
									</FormItem>
								);
							}}
						/>
						{headers.length > 1 && (
							<Button
								type="button"
								variant="secondary"
								onClick={() => removeHeader(index)}
							>
								<Trash2 size={16} />
							</Button>
						)}
					</div>
				);
			})}
			{headers.every(
				(_, index) =>
					form.getValues(`healthcheck.headers.${index}.name`) &&
					form.getValues(`healthcheck.headers.${index}.value`),
			) && (
				<div>
					<Button
						type="button"
						variant="secondary"
						onClick={() =>
							appendHeader({
								name: "",
								value: "",
							})
						}
					>
						{t("add")}
					</Button>
				</div>
			)}
		</>
	);
};

export default HeadersFormSection;
