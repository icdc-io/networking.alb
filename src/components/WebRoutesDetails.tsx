import { getRouteDetails } from "@/queries/getRouteDetails";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import ButtonBack from "../general/buttonBack";
import WebRoutesDetailsContent from "./WebRoutesDetailsContent";

const WebRoutesDetails = () => {
	const { id } = useParams();
	const { data, isError, isFetching } = getRouteDetails(id);

	return (
		<div className="flex flex-col gap-4 h-full">
			<div>
				<ButtonBack />
			</div>
			{isFetching ? (
				<Loader />
			) : isError ? (
				<ErrorScreen />
			) : !data ? null : (
				<WebRoutesDetailsContent route={data} />
			)}
		</div>
	);
};

export default WebRoutesDetails;
