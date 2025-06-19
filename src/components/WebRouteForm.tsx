import { getCertificatesList } from "@/queries/getCertificatesList";
import { getGatewaysList } from "@/queries/getGatewaysList";
import { WebRouteFormSchema } from "@/schemas/WebRouteFormSchema";
import { Button } from "container/Button";
import { Form, FormField, useForm, zodResolver } from "container/Form";
import { useAppSelector } from "container/ReduxActions";

import { WEB_ROUTES_FETCH_URL, getFullPath, webRouteUrl } from "@/AppConstants";
import { webRoutesPath } from "@/constants/routes";
import {
	type ContentField,
	FIELD_TYPES,
	type FieldsTypes,
	type FormFieldComponent,
	type RouteInfo,
	type SelectField,
	certificatesToOptions,
	createFormSections,
	initialState,
	insecureOptions,
	methodsOptions,
	optionsOfScheme,
	tlsOptions,
	toInitialValues,
	toRequestBody,
} from "@/constants/webRouteForm";
import ButtonBack from "@/general/buttonBack";
import { getRoutesList } from "@/queries/getRoutesList";
import type { components } from "@/schemas/balancer-api";
import { useMutateData } from "container/Api";
import { type FC, Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import AltServices from "./AltServices";
import CancelChangesModal, { type CancelModalRef } from "./CancelChangesModal";
import FormCheckbox from "./FormCheckbox";
import FormCombobox from "./FormCombobox";
import FormInput from "./FormInput";
import FormRadio from "./FormRadio";
import FormSelect from "./FormSelect";
import HeadersFormSection from "./HeadersFormSection";

type WebRouteFormType = {
	initialValues?: RouteInfo;
	refetch?: () => void;
};

const WebRouteForm: FC<WebRouteFormType> = ({ initialValues, refetch }) => {
	const { t } = useTranslation();
	const { id } = useParams();
	const isEditing = !!initialValues;
	const userEmail = useAppSelector((state) => state.host.email);
	const { data: certificates = [], isSuccess: certsFetchSuccess } =
		getCertificatesList();
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
	const { refetch: refetchRoutesList } = getRoutesList();
	const ref = useRef<CancelModalRef>(null);
	const isSecure = form.watch("isSecure");

	const navigate = useNavigate();

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
		}).then(() => {
			if (isEditing) refetch?.();
			refetchRoutesList();
			navigate("..", { relative: "path" });
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isGatewaysFetchSuccess || isEditing) return;
		form.setValue(
			"cloud_gateway_id",
			gateways[0].id ? `${gateways[0].id}` : "",
		);
	}, [isGatewaysFetchSuccess, isEditing]);

	useEffect(() => {
		if (!isSecure) {
			form.setValue("certificate_id", "");
			form.setValue("insecure", "");
			form.setValue("tls_termination", "");
		}
	}, [isSecure]);

	const healthCheckSubtitle = (
		<h5 className="font-base font-bold">{t("healthCheck")}</h5>
	);

	const fieldsByTypes = {
		[FIELD_TYPES.INPUT]: FormInput,
		[FIELD_TYPES.SELECT]: FormSelect,
		[FIELD_TYPES.RADIO]: FormRadio,
		[FIELD_TYPES.CHECKBOX]: FormCheckbox,
		[FIELD_TYPES.CONTENT]: null,
		[FIELD_TYPES.COMBOBOX]: FormCombobox,
	};

	const certificatesOptions = certificatesToOptions(
		certificates.filter((el) => el.id),
	);

	const cloudGatewaysOptions = gateways
		.filter((gateway) => gateway.id)
		.map((el) => ({
			text: `${el.cloudgw_instance} (${el.account}) ${el.name}`,
			value: `${el.id}`,
		}));

	const options = {
		cloud_gateway_id: cloudGatewaysOptions,
		"healthcheck.scheme": optionsOfScheme,
		"healthcheck.method": methodsOptions,
		tls_termination: tlsOptions,
		insecure: insecureOptions,
		certificate_id: certificatesOptions,
	};

	const formSections = createFormSections([
		<AltServices key={"AltService"} form={form} />,
		healthCheckSubtitle,
		<HeadersFormSection key={"HeadersFormSection"} form={form} />,
	]);

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
				if (
					fieldInfo.type === FIELD_TYPES.CONTENT &&
					!!(fieldInfo as ContentField).content
				)
					return isHidden(fieldInfo.valuesToHide) ? null : (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
			<CancelChangesModal
				ref={ref}
				onConfirm={() => navigate(webRoutesPath())}
			/>
		</div>
	);
};

export default WebRouteForm;
