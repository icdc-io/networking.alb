import { CERTIFICATES_FETCH_URL, certificateUrl } from "@/AppConstants";
import { getCertificatesList } from "@/queries/getCertificatesList";
import { CertificateForm } from "@/schemas/CertificateForm";
import type { components, paths } from "@/schemas/balancer-api";
import { useMutateData } from "container/Api";
import { Button } from "container/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
	zodResolver,
} from "container/Form";
import { Input } from "container/Input";
import { useAppSelector } from "container/ReduxActions";
import { Textarea } from "container/Textarea";
import {
	type ChangeEvent,
	type DragEvent,
	type FC,
	type FocusEvent,
	type MouseEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { getFullPath } from "../AppConstants";
import CancelChangesModal, { type CancelModalRef } from "./CancelChangesModal";

const certFields = {
	cert: "",
	key: "",
	ca: "",
	dest_ca: "",
};

const initialData = {
	name: "",
	...certFields,
};
const initialCertificatesData = {
	pathCertificate: "",
	textCertificate: "",
	pathPrivateKey: "",
	textPrivateKey: "",
	pathCaCertificate: "",
	textCaCertificate: "",
	pathDCaCertificate: "",
	textDCaCertificate: "",
};

type CreateEditCertificateForm = {
	initialFormState:
		| paths["/certificates/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
		| undefined;
};

type CertificateBody = {
	certificate: { owner: string | undefined } & typeof initialData;
};

const CreateEditCertificateForm: FC<CreateEditCertificateForm> = ({
	initialFormState,
}) => {
	const isEditing = !!initialFormState;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams();
	const userEmail = useAppSelector((state) => state.host.email);
	const { mutateAsync } = useMutateData<
		components["schemas"]["Certificate_POST"],
		CertificateBody
	>({});
	const { refetch } = getCertificatesList();
	const form = useForm({
		resolver: zodResolver(CertificateForm),
		defaultValues: initialFormState
			? {
					...initialFormState.values,
					name: initialFormState.name,
				}
			: initialData,
	});
	const [fileNames, setFileNames] = useState(certFields);

	const [certificatesData, setCertificatesData] = useState(
		initialCertificatesData,
	);

	const ref = useRef<CancelModalRef>(null);

	useEffect(() => {
		if (!initialFormState) return;
		setFileNames({
			cert: initialFormState.cert_path,
			key: initialFormState.key_path,
			ca: initialFormState.ca_path,
			dest_ca: initialFormState.dest_ca_path,
		});
	}, [initialFormState]);

	const setFileInfo = (file: File, text: string, name: string) => {
		const fieldName = text as keyof typeof certFields;
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = () => {
			setCertificatesData({
				...certificatesData,
				[text]: reader.result,
			});
			form.setValue(fieldName, (reader.result as string) || "");
			setFileNames((prevState) => ({
				...prevState,
				[name]: file.name,
			}));
		};
	};

	const handleFile = (e: DragEvent<HTMLInputElement>, text: string) => {
		e.preventDefault();
		const data = e.dataTransfer;
		const file = data.files[0];
		if (file) setFileInfo(file, text, (e.target as HTMLInputElement).name);
	};

	const onChangeFile = (e: ChangeEvent<HTMLInputElement>, text: string) => {
		e.preventDefault();
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) setFileInfo(file, text, (e.target as HTMLInputElement).name);
	};

	const onChangeField = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	) =>
		setCertificatesData({
			...certificatesData,
			[e.target.name]: e.target.value,
		});

	const handleDragEnter = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

	const onClickCertificate = (e: MouseEvent<HTMLButtonElement>) => {
		(
			(e.target as HTMLButtonElement).parentNode
				?.children[2] as HTMLButtonElement
		).click();
	};

	const onFocus = (e: FocusEvent<HTMLInputElement>) => {
		const parent = e.target.parentNode as HTMLDivElement;
		if (parent) {
			parent.setAttribute("data-active", "true");
		}
	};

	const onBlur = (e: FocusEvent<HTMLInputElement>) => {
		const parent = e.target.parentNode as HTMLDivElement;
		if (parent) parent.setAttribute("data-active", "false");
	};

	const displayCertificatesFields = Object.keys(certFields).map((el) => {
		const fieldName = el as keyof typeof certFields;
		return (
			<FormField
				key={el}
				control={form.control}
				name={fieldName}
				render={({ field }) => {
					return (
						<FormItem>
							<FormLabel>
								<b>{t(`${el}_label`)}</b>
							</FormLabel>
							<FormControl>
								<>
									<div className="relative" data-active={false}>
										<Input
											value={fileNames[fieldName]}
											name={el}
											onChange={onChangeField}
											className="outline-ee"
											disabled
										/>
										<Button
											onClick={onClickCertificate}
											className="absolute right-0 top-0"
											variant="secondary"
											type="button"
										>
											{t("browse")}
										</Button>
										<input
											className="dragArea"
											type="file"
											name={el}
											onDrop={(e) => handleFile(e, el)}
											onDragOver={handleDragOver}
											onDragEnter={handleDragEnter}
											onDragLeave={handleDragLeave}
											onChange={(e) => onChangeFile(e, el)}
											onFocus={onFocus}
											onBlur={onBlur}
											accept=".pem"
										/>
									</div>
									<div>
										<span className="subTitleForm">
											{t(`${el}_description`)}
										</span>
									</div>
									<div>
										<Textarea {...field} value={field.value} />
									</div>
								</>
							</FormControl>
						</FormItem>
					);
				}}
			/>
		);
	});

	const onSubmit = (values: z.infer<typeof CertificateForm>) => {
		mutateAsync({
			method: isEditing ? "PUT" : "POST",
			endpoint: isEditing
				? getFullPath(certificateUrl(id))
				: getFullPath(CERTIFICATES_FETCH_URL),
			body: {
				certificate: {
					...values,
					owner: isEditing ? initialFormState.owner : userEmail,
				},
			},
		}).then(() => {
			refetch();
			navigate("../..", { relative: "path" });
		});
	};

	const isSubmitDisabled = isEditing
		? !form.formState.isDirty
		: !form.getValues("name").trim();

	const onCancel = (_e: React.MouseEvent<HTMLButtonElement>) => {
		if (ref.current) {
			ref.current.handleClick();
		}
	};

	return (
		<div className="flex flex-col h-full">
			<h2 className="page-title certificateHeader">
				{isEditing ? t("editCertificate") : t("createCertificate")}
			</h2>
			<p className="subTitleForm">{t("certificateDescript")}</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={"flex flex-col gap-4 mt-4 h-full"}
				>
					<FormField
						key={"name"}
						control={form.control}
						name={"name"}
						render={({ field }) => {
							const { error } = form.getFieldState("name");
							return (
								<FormItem>
									<FormLabel>
										<b>{t("name")}</b>
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t("name")}
											{...field}
											value={String(field.value)}
										/>
									</FormControl>
									{error?.message && (
										<FormMessage>{t(error.message)}</FormMessage>
									)}
								</FormItem>
							);
						}}
					/>
					{displayCertificatesFields}
					<div className="flex gap-4 justify-end cert-form-actions mt-auto">
						<Button type="button" onClick={onCancel} variant="secondary">
							{t("cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitDisabled}>
							{isEditing ? t("save") : t("create")}
						</Button>
					</div>
				</form>
			</Form>
			<CancelChangesModal ref={ref} onConfirm={() => navigate(-1)} />
		</div>
	);
};

export default CreateEditCertificateForm;
