import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import { getCertificateDetails } from "@/queries/getCertificateDetails";
import ButtonBack from "../general/buttonBack";
import CertificateDetailsContent from "./CertificateDetailsContent";

const CertificateDetails = () => {
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
			) : certificateDetails ? (
				<CertificateDetailsContent data={certificateDetails} />
			) : null}
		</div>
	);
};

export default CertificateDetails;
