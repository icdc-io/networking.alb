import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	type UseFormReturn,
	useFieldArray,
} from "container/Form";
import { Input } from "container/Input";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { FIELD_TYPES, servicesToOptions } from "@/constants/webRouteForm";
import { getServicesList } from "@/queries/getServicesList";
import type { WebRouteFormSchema } from "@/schemas/WebRouteFormSchema";
import FormCombobox from "./FormCombobox";

type AltServices = {
	form: UseFormReturn<z.infer<typeof WebRouteFormSchema>>;
};

const AltServices: FC<AltServices> = ({ form }) => {
	const { t } = useTranslation();
	const { data: services = [] } = getServicesList();

	const { fields, append, remove } = useFieldArray({
		name: "services",
		control: form.control,
	});

	const addService = () => {
		if (!form.getValues(`services.${fields.length - 1}.weight`))
			form.setValue(`services.${fields.length - 1}.weight`, "1");
		append({
			id: "",
			weight: "",
		});
	};

	const deleteService = (index: number) => () => {
		if (fields.length === 1) {
			form.setValue("services.0", {
				id: "",
				weight: "",
			});
			return;
		}
		remove(index);
	};

	return fields.map((field, index) => {
		return (
			<section className="addService flex" key={field.id}>
				<div className="addService-item">
					<FormField
						control={form.control}
						name={`services.${index}.id`}
						render={({ field }) => {
							const { error } = form.getFieldState(`services.${index}.id`);
							return (
								<FormCombobox
									field={field}
									error={error}
									fieldInfo={{
										type: FIELD_TYPES.COMBOBOX,
										name: `services.${index}.id`,
										options: servicesToOptions(services),
										placeholder: ["none"],
										label: ["service"],
										description: "altService",
									}}
								/>
							);
						}}
					/>
					{
						<div className="altServiceControl">
							<button type="button" onClick={deleteService(index)}>
								{t("deleteService")}
							</button>
							|
							<button type="button" onClick={addService}>
								{t("anotherService")}
							</button>
						</div>
					}
				</div>
				{fields.length > 1 && (
					<div className="addService-item">
						<FormField
							control={form.control}
							name={`services.${index}.weight`}
							render={({ field }) => {
								const { error } = form.getFieldState(
									`services.${index}.weight`,
								);
								return (
									<FormItem>
										<FormLabel>
											<b>{t("weight")}</b>
										</FormLabel>
										<FormControl>
											<Input {...field} value={String(field.value)} />
										</FormControl>
										<FormDescription>{t("weightDescript")}</FormDescription>
										{error?.message && (
											<FormMessage>{t(error.message)}</FormMessage>
										)}
									</FormItem>
								);
							}}
						/>
					</div>
				)}
			</section>
		);
	});
};

export default AltServices;
