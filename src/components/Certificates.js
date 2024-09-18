import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "semantic-ui-react";
import { fetchCertificates } from "../AppActions";
import CertificatesList from "./CertificatesList";
import LoadBalancerHeaderContent from "./LoadBalancerHeaderContent";
const ErrorScreen = React.lazy(() => import("container/ErrorScreen"));

const Certificates = () => {
  const certificates = useSelector((state) => state.BalancerStore.certificates);
  const certificatesFetchStatus = useSelector(
    (state) => state.BalancerStore.certificatesStatus,
  );
  const user = useSelector((state) => state.host.user);

  const dispatch = useDispatch();

  useEffect(() => {
    Object.keys(user).length !== 0 && dispatch(fetchCertificates());
  }, [dispatch, user.role, user.location, user.account]);

  const isError = certificatesFetchStatus === "rejected";

  const isLoading =
    certificatesFetchStatus === "pending" || !certificatesFetchStatus;

  const isNoData = certificates.length < 1;

  return isError ? (
    <ErrorScreen />
  ) : isLoading ? (
    <Loader active inline="centered" />
  ) : isNoData ? (
    <LoadBalancerHeaderContent isNoData={isNoData} title={"certificates"} />
  ) : (
    <CertificatesList items={certificates} />
  );
};

export default Certificates;
