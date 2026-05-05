import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import { getCertificateDetails } from "@/queries/getCertificateDetails";
import ButtonBack from "../general/buttonBack";
import CreateEditCertificateForm from "./CreateEditCertificateForm";

const CreateEditCertificate = () => {
	const { id } = useParams();

	const certDetails = getCertificateDetails(id);

	return (
		<div className="flex flex-col gap-4 h-full">
			<div>
				<ButtonBack />
			</div>
			{certDetails.isFetching ? (
				<Loader />
			) : certDetails.isError ? (
				<ErrorScreen />
			) : (
				<CreateEditCertificateForm certDetails={certDetails} />
			)}
		</div>
	);
};

export default CreateEditCertificate;
