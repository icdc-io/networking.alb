import { useQueryClient } from "@tanstack/react-query";
import { useMutateData } from "container/Api";
import { Button } from "container/Button";
import { Form, FormField, useForm, zodResolver } from "container/Form";
import { useAppSelector } from "container/ReduxActions";
import { type FC, Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { getFullPath, WEB_ROUTES_FETCH_URL, webRouteUrl } from "@/AppConstants";
import {
	type ContentField,
	certificateDefaultOptions,
	certificatesToOptions,
	FIELD_TYPES,
	type FieldsTypes,
	type FormFieldComponent,
	initialState,
	insecureOptions,
	methodsOptions,
	optionsOfScheme,
	type SelectField,
	TlsTermination,
	tlsOptions,
	toInitialValues,
	toRequestBody,
	useCertificatePassthroughOptions,
	useCreateFormSections,
} from "@/constants/webRouteForm";
import ButtonBack from "@/general/buttonBack";
import { getCertificatesList } from "@/queries/getCertificatesList";
import { getGatewaysList } from "@/queries/getGatewaysList";
import type { getRouteDetails } from "@/queries/getRouteDetails";
import type { components } from "@/schemas/balancer-api";
import { WebRouteFormSchema } from "@/schemas/WebRouteFormSchema";
import CancelChangesModal, { type CancelModalRef } from "./CancelChangesModal";
import FormCheckbox from "./FormCheckbox";
import FormCombobox from "./FormCombobox";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormSelect from "./FormSelect";

type WebRouteFormType = {
	routeDetails?: ReturnType<typeof getRouteDetails>;
};

const WebRouteForm: FC<WebRouteFormType> = ({ routeDetails }) => {
	const initialValues = routeDetails?.data;
	const { t } = useTranslation();
	const { id } = useParams();
	const isEditing = !!initialValues;
	const userEmail = useAppSelector((state) => state.host.email);
	const { data: certificates = [] } = getCertificatesList();
	const { data: gateways = [], isSuccess: isGatewaysFetchSuccess } =
		getGatewaysList();
	const form = useForm<z.infer<typeof WebRouteFormSchema>>({
		resolver: zodResolver(WebRouteFormSchema),
		defaultValues: initialValues
			? toInitialValues(initialValues)
			: initialState,
	});
	const { mutateAsync } = useMutateData<
		components["schemas"]["Route"]["route"],
		components["schemas"]["Route_POST"]
	>({});
	const ref = useRef<CancelModalRef>(null);
	const isSecure = form.watch("isSecure");
	const queryClient = useQueryClient();
	const values = form.watch(form.control);

	const navigate = useNavigate();

	const certificatePassthroughOptions = useCertificatePassthroughOptions();

	const onSubmit = (values: z.infer<typeof WebRouteFormSchema>) => {
		const body = {
			route: {
				...toRequestBody(values),
				owner: userEmail,
			},
		};
		mutateAsync({
			method: isEditing ? "PUT" : "POST",
			endpoint: getFullPath(isEditing ? webRouteUrl(id) : WEB_ROUTES_FETCH_URL),
			body,
		}).then((res) => {
			if (isEditing)
				queryClient.setQueryData(routeDetails.queryKey, () => ({ route: res }));

			navigate("..", { relative: "path" });
		});
	};

	useEffect(() => {
		if (!isGatewaysFetchSuccess || isEditing) return;
		form.setValue(
			"cloud_gateway_id",
			gateways[0].id ? `${gateways[0].id}` : "",
		);
	}, [isGatewaysFetchSuccess, isEditing]);

	const certificatesOptions = certificatesToOptions(
		certificates.filter((el) => el.id),
	);

	const cloudGatewaysOptions = gateways
		.filter((gateway) => gateway.id)
		.map((el) => ({
			text: `${el.cloudgw_instance} (${el.account}) ${el.name}`,
			value: `${el.id}`,
		}));

	const tlsTermination = form.watch("tls_termination");

	const options = {
		cloud_gateway_id: cloudGatewaysOptions,
		"healthcheck.scheme": optionsOfScheme,
		"healthcheck.method": methodsOptions,
		tls_termination: tlsOptions,
		insecure: insecureOptions,
		certificate_id:
			tlsTermination === TlsTermination.PASSTHROUGH
				? certificatePassthroughOptions
				: [...certificateDefaultOptions, ...certificatesOptions],
	};

	useEffect(() => {
		if (!isSecure) {
			form.setValue("certificate_id", "");
			form.setValue("insecure", "");
			form.setValue("tls_termination", "");
		}
	}, [isSecure]);

	useEffect(() => {
		if (!isEditing && isSecure) {
			form.setValue("certificate_id", options.certificate_id[0].value);
			form.setValue("tls_termination", options.tls_termination[0].value);
		}
		if (isEditing && isSecure) {
			toInitialValues(initialValues).certificate_id
				? form.setValue(
						"certificate_id",
						toInitialValues(initialValues).certificate_id,
					)
				: form.setValue("certificate_id", options.certificate_id[0].value);

			toInitialValues(initialValues).tls_termination
				? form.setValue(
						"tls_termination",
						toInitialValues(initialValues).tls_termination,
					)
				: form.setValue("tls_termination", options.tls_termination[0].value);
		}
	}, [isEditing, isSecure]);

	const fieldsByTypes = {
		[FIELD_TYPES.INPUT]: FormInput,
		[FIELD_TYPES.SELECT]: FormSelect,
		[FIELD_TYPES.RADIO]: FormRadio,
		[FIELD_TYPES.CHECKBOX]: FormCheckbox,
		[FIELD_TYPES.CONTENT]: null,
		[FIELD_TYPES.COMBOBOX]: FormCombobox,
	};

	const formSections = useCreateFormSections(form);

	const isHidden = (hideInfo: string[] | undefined) => {
		if (!hideInfo) return false;
		return hideInfo?.some(
			(fieldName) => !form.getValues(fieldName as keyof typeof form.getValues),
		);
	};

	const onCancel = (_e: React.MouseEvent<HTMLButtonElement>) => {
		if (ref.current) {
			ref.current.handleClick();
		}
	};

	const formFields = formSections.map((sectionInfo) => (
		<div className="routeBlock" key={sectionInfo.title}>
			<h4>{t(sectionInfo.title)}</h4>
			{sectionInfo.description && (
				<span className="subTitleForm">{t(sectionInfo.description)}</span>
			)}
			{sectionInfo.fields.map((fieldInfo, key) => {
				if (typeof fieldInfo.hidden === "function" && fieldInfo.hidden(values))
					return null;
				if (
					fieldInfo.type === FIELD_TYPES.CONTENT &&
					(fieldInfo as ContentField).content
				)
					return isHidden(fieldInfo.valuesToHide) ? null : (
						<Fragment key={key}>{(fieldInfo as ContentField).content}</Fragment>
					);

				const formFieldInfo = fieldInfo as Exclude<FieldsTypes, ContentField>;

				if (isHidden(formFieldInfo.valuesToHide)) return null;

				const Component = fieldsByTypes[formFieldInfo.type] as FC<
					FormFieldComponent<typeof formFieldInfo>
				>;

				if (!Component) return null;

				if (formFieldInfo.type === FIELD_TYPES.SELECT)
					(formFieldInfo as SelectField).options =
						options[formFieldInfo.name as keyof typeof options];

				if (
					formFieldInfo.name === "certificate_id" &&
					tlsTermination === TlsTermination.PASSTHROUGH
				) {
					(formFieldInfo as SelectField).disabled = true;
				}

				return (
					<FormField
						key={formFieldInfo.name}
						control={form.control}
						name={formFieldInfo.name as keyof typeof form.getValues}
						render={({ field }) => {
							const { error } = form.getFieldState(
								formFieldInfo.name as keyof typeof form.getValues,
							);
							return (
								<Component
									error={error}
									field={field}
									fieldInfo={formFieldInfo}
								/>
							);
						}}
					/>
				);
			})}
		</div>
	));

	return (
		<div className="flex flex-col gap-4 h-full">
			<div>
				<ButtonBack />
			</div>
			<h2 className="page-title">
				{t(isEditing ? "editRoute" : "createRoute")}
			</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="formContainer h-full"
				>
					{formFields}
					<div className="formActions">
						<Button variant="secondary" type="button" onClick={onCancel}>
							{t("cancel")}
						</Button>
						<Button type="submit">{t("save")}</Button>
					</div>
				</form>
			</Form>
			<CancelChangesModal ref={ref} onConfirm={() => navigate(-1)} />
		</div>
	);
};

export default WebRouteForm;
