import { getCertificateDetails } from "@/queries/getCertificateDetails";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import ButtonBack from "../general/buttonBack";
import CreateEditCertificateForm from "./CreateEditCertificateForm";

const CreateEditCertificate = () => {
	const { id } = useParams();

	const {
		data: certificateDetails,
		isFetching,
		isError,
	} = getCertificateDetails(id);

	return (
		<div className="flex flex-col gap-4 h-full">
			<div>
				<ButtonBack />
			</div>
			{isFetching ? (
				<Loader />
			) : isError ? (
				<ErrorScreen />
			) : (
				<CreateEditCertificateForm initialFormState={certificateDetails} />
			)}
		</div>
	);
};

export default CreateEditCertificate;
