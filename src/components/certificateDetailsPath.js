import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Grid, Header, Loader } from "semantic-ui-react";
import { fetchCertificate, updateCertificateReset } from "../AppActions";
import { certificatesPath } from "../constants/routes";
import ButtonBack from "../general/buttonBack";
import CertificateImg from "../static/images/certificate.svg";
import DeleteModal from "./DeleteModal";
import "./loadBalancer.scss";

const ApiButton = React.lazy(() => import("container/ApiButton"));
const NoContent = React.lazy(() => import("container/networking/NoContent"));
const CodeSnippet = React.lazy(
  () => import("container/networking/CodeSnippet"),
);

const CertificateDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  const certificate = useSelector((state) => state.BalancerStore.certificate);
  const certificateStatus = useSelector(
    (state) => state.BalancerStore.certificateStatus,
  );
  const certificateDeleteStatus = useSelector(
    (state) => state.BalancerStore.certificateDeleteStatus,
  );
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCertificate(id));
    dispatch(updateCertificateReset());
  }, [dispatch, id, user]);

  if (certificateDeleteStatus === "fulfilled") {
    return navigate(certificatesPath());
  }

  const certificatesData = [
    {
      title: "certificate",
      value: certificate.values?.cert,
    },
    {
      title: "key",
      value: certificate.values?.key,
    },
    {
      title: "caCertificate",
      value: certificate.values?.ca,
    },
    {
      title: "destinationCertificate",
      value: certificate.values?.dest_ca,
    },
  ];

  const copy = (value) => navigator.clipboard.writeText(value);

  const cerificateList = certificatesData.map((e, index) =>
    e.value ? (
      <Grid.Row className="cert-details-row" key={index}>
        <div className="api-dialog-snippet-wrapper display-certificate">
          <CodeSnippet
            title={t(e.title)}
            content={e.value}
            copyFuncion={copy}
          />
        </div>
      </Grid.Row>
    ) : (
      <Grid.Row className="cert-details-row-none" key={index}>
        <Grid.Row className="cert-details-row">
          <Header as="h4">{t([e.title])}</Header>
        </Grid.Row>
        <Grid.Row className="cert-details-row">
          <p>{t("none")}</p>
        </Grid.Row>
      </Grid.Row>
    ),
  );

  if (certificateStatus === "rejected") {
    return <NoContent icon="desktop" textMessage={t("wrong")} />;
  }

  return (
    <section>
      <ButtonBack back={t("back")} path={".."} />
      {certificateStatus !== "fulfilled" || !Object.keys(certificate).length ? (
        <Loader active inline="centered" />
      ) : (
        <>
          <Grid className="certificate-details">
            <div className="certificate-details-header">
              <Header>
                <div>
                  <img src={CertificateImg} width="35" alt="Certificate" />
                </div>
                &nbsp;&nbsp;
                {certificate.name}
              </Header>
              <span>
                <div className="create-route-buttons">
                  <Link to={"edit"}>
                    <Button basic color="black" size="medium">
                      {t("edit")}
                    </Button>
                  </Link>
                  <ApiButton
                    element="certificate"
                    user={user}
                    locationUrl={baseUrls[user.location]}
                  />
                </div>
              </span>
            </div>
            {cerificateList}
            <Grid.Row verticalAlign="middle" className="network-delete">
              <div>
                <b>{`${t("delete")} ${t("certificate")}`.toUpperCase()}</b>
                <p>{t("cannotBeUndone")}</p>
              </div>
              <DeleteModal type="certificates" button instance={certificate} />
            </Grid.Row>
          </Grid>
        </>
      )}
    </section>
  );
};

export default CertificateDetails;
