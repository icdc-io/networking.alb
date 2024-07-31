import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CertificatesList from "./CertificatesList";
import { fetchCertificates } from "../AppActions";
import LoadBalancerHeaderContent from "./LoadBalancerHeaderContent";
import { Loader } from "semantic-ui-react";

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
    "Error"
  ) : isLoading ? (
    <Loader active inline="centered" />
  ) : isNoData ? (
    <LoadBalancerHeaderContent isNoData={isNoData} title={"certificates"} />
  ) : (
    <CertificatesList items={certificates} />
  );
};

export default Certificates;
