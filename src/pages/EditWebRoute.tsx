import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { useParams } from "react-router-dom";
import WebRouteForm from "@/components/WebRouteForm";
import { getRouteDetails } from "@/queries/getRouteDetails";

const EditWebRoute = () => {
	const { id } = useParams();
	const { data, isFetching, isError, refetch } = getRouteDetails(id);

	if (isFetching) return <Loader />;

	if (isError) return <ErrorScreen />;

	if (!data) return null;

	return <WebRouteForm initialValues={data} refetch={refetch} />;
};

export default EditWebRoute;
