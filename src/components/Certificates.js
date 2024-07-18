import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CertificatesList from "./CertificatesList";
import { fetchCertificates } from "../AppActions";
import LoadBalancerHeaderContent from "./LoadBalancerHeaderContent";

const ContentPage = React.lazy(() => import("container/ContentPage"));

const Certificates = () => {
  const certificates = useSelector((state) => state.BalancerStore.certificates);
  const certificatesFetchStatus = useSelector(
    (state) => state.BalancerStore.certificatesStatus,
  );
  const user = useSelector((state) => state.host.user);

  const dispatch = useDispatch();
  useEffect(() => {
    Object.keys(user).length !== 0 && dispatch(fetchCertificates());
  }, [dispatch, user.role, user.location, user.account, user]);

  return (
    <ContentPage
      statuses={[certificatesFetchStatus]}
      pageData={certificates}
      title={"certificates"}
      componentDataList={CertificatesList}
      noContentMessage={"noCertificates"}
      traefik
    >
      <LoadBalancerHeaderContent
        isNoData={certificates.length < 1}
        title={"certificates"}
      />
    </ContentPage>
  );
};

export default Certificates;
