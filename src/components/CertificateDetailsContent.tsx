import { getFullPath } from "@/AppConstants";
import { certificateUrl } from "@/AppConstants";
import type { Certificate } from "@/entities/Certificate";
import { useMutateData } from "container/Api";
import { Button } from "container/Button";
import CodeSnippet from "container/CodeSnippet";
import { type FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import CertificateImg from "../static/images/certificate.svg";
import BalancerApiButton from "./BalancerApiButton";
import DeleteModal, { type ModalRef } from "./DeleteModal";

type Instance = Omit<
	Certificate,
	"cert_path" | "key_path" | "string" | "dest_ca_path" | "ca_path" | "values"
>;

type CertificateDetailsContent = {
	data: Certificate;
	refetch: () => void;
};

const CertificateDetailsContent: FC<CertificateDetailsContent> = ({
	data,
	refetch,
}) => {
	const { t } = useTranslation();
	const ref = useRef<ModalRef<Instance>>(null);
	const { mutateAsync } = useMutateData({});
	const navigate = useNavigate();

	const certificatesData = [
		{
			title: "cert_label",
			value: data.values.cert,
		},
		{
			title: "key_label",
			value: data.values.key,
		},
		{
			title: "ca_label",
			value: data.values.ca,
		},
		{
			title: "dest_ca_label",
			value: data.values.dest_ca,
		},
	];

	const certificateList = certificatesData.map((e, index) =>
		e.value ? (
			<div className="fle flex-col cert-details-row" key={index}>
				<div className="api-dialog-snippet-wrapper display-certificate">
					<CodeSnippet title={t(e.title)} content={e.value} />
				</div>
			</div>
		) : (
			<div className="flex flex-col cert-details-row-none" key={index}>
				<div className="flex cert-details-row">
					<h4>{t([e.title])}</h4>
				</div>
				<div className="flex cert-details-row">
					<p>{t("none")}</p>
				</div>
			</div>
		),
	);

	const onDeleteConfirm = (instance: Instance) => {
		return mutateAsync({
			method: "DELETE",
			endpoint: getFullPath(certificateUrl(instance.id)),
		}).then(() => {
			refetch();
			navigate("..");
		});
	};

	const onDelete =
		(instance: Instance) => (_e: React.MouseEvent<HTMLButtonElement>) => {
			if (ref.current) {
				ref.current.handleClick(instance);
			}
		};

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between">
				<div className="flex items-center gap-4">
					<img src={CertificateImg} width="35" alt="Certificate" />
					<h2>{data.name}</h2>
				</div>
				<span>
					<div className="create-route-buttons">
						<BalancerApiButton name="certificate" />
						<Link to={"edit"}>
							<Button color="black" variant="outline">
								{t("edit")}
							</Button>
						</Link>
					</div>
				</span>
			</div>
			{certificateList}
			<div className="network-delete flex-wrap gap-2">
				<div>
					<b>{`${t("delete")} ${t("certificate")}`.toUpperCase()}</b>
					<p>{t("cannotBeUndone")}</p>
				</div>
				<Button variant="outline" color="red" onClick={onDelete(data)}>
					{t("delete")}
				</Button>
			</div>
			<DeleteModal
				ref={ref}
				title="deleteCertificateHead"
				description={"deleteCertificate"}
				onSubmit={onDeleteConfirm}
			/>
		</div>
	);
};

export default CertificateDetailsContent;
