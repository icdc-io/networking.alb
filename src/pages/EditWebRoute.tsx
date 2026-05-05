import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import WebRouteForm from "@/components/WebRouteForm";
import { getRouteDetails } from "@/queries/getRouteDetails";

const EditWebRoute = () => {
	const { id } = useParams();
	const routeDetails = getRouteDetails(id);

	if (routeDetails.isFetching) return <Loader />;

	if (routeDetails.isError) return <ErrorScreen />;

	if (!routeDetails.data) return null;

	return <WebRouteForm routeDetails={routeDetails} />;
};

export default EditWebRoute;
