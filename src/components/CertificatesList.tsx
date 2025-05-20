import { getFullPath } from "@/AppConstants";
import { certificateUrl } from "@/AppConstants";
import type { Certificate } from "@/entities/Certificate";
import { useMutateData } from "container/Api";
import OptionsMenu from "container/OptionsMenu";
import { Table, TableBody, TableCell, TableRow } from "container/Table";
import { type FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import CertificateImg from "../static/images/certificate.svg";
import DeleteModal, { type ModalRef } from "./DeleteModal";

type CertificateInstance = Certificate;

type Instance = Omit<
	CertificateInstance,
	"cert_path" | "key_path" | "string" | "dest_ca_path" | "ca_path" | "values"
>;

type CertificatesList = {
	items: CertificateInstance[];
	refetch: () => void;
};

const CertificatesList: FC<CertificatesList> = ({ items, refetch }) => {
	const { mutateAsync } = useMutateData({});
	const navigate = useNavigate();
	const ref = useRef<ModalRef<Instance>>(null);
	const { t } = useTranslation();

	const onEdit = (instance: CertificateInstance) => (_e: Event) =>
		navigate(`${instance.id}/edit`);

	const onDelete = (instance: Instance) => (_e: Event) => {
		if (ref.current) {
			ref.current.handleClick(instance);
		}
	};

	const options = [
		{
			text: "edit",
			action: onEdit,
		},
		{
			text: "delete",
			action: onDelete,
			color: "red" as const,
		},
	];

	const onDeleteConfirm = (instance: Instance) => {
		return mutateAsync({
			method: "DELETE",
			endpoint: getFullPath(certificateUrl(instance.id)),
		}).then(refetch);
	};

	const isItemsExists = items.length > 0;

	const certificates = isItemsExists ? (
		items.map((el: CertificateInstance) => {
			return (
				<TableRow key={el.id}>
					<TableCell align="left">
						<div className="name-wrapper">
							<img src={CertificateImg} width="35" alt="Certificate" />
							<Link to={`${el.id}`}>{el.name}</Link>
						</div>
					</TableCell>
					<TableCell align="right">
						<OptionsMenu options={options} instance={el} />
					</TableCell>
				</TableRow>
			);
		})
	) : (
		<TableRow>
			<TableCell align="center" colSpan={2}>
				<b>{t("listEmpty")}</b>
			</TableCell>
		</TableRow>
	);

	return (
		<div className="table-container h-full">
			<Table
				className="bordered h-full"
				containerClassName={isItemsExists ? undefined : "h-full"}
			>
				<TableBody>{certificates}</TableBody>
			</Table>
			<DeleteModal
				ref={ref}
				title="deleteCertificateHead"
				description={"deleteCertificate"}
				onSubmit={onDeleteConfirm}
			/>
		</div>
	);
};

export default CertificatesList;
