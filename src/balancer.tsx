import { useQueryClient } from "@tanstack/react-query";
import { getAppId } from "container/Api";
import Loader from "container/Loader";
import { useEffect, useState } from "react";
import LoadBalancerOverview from "./components/overview";
import "./App.scss";

const Balancer = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		setIsLoaded(true);
		return () => {
			const appId = getAppId(window.location.pathname);
			queryClient.removeQueries({ queryKey: [appId], exact: false });
		};
	}, []);

	return isLoaded ? <LoadBalancerOverview /> : <Loader />;
};

export default Balancer;
