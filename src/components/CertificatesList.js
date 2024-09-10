import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Input, Table } from "semantic-ui-react";
import OptionsMenu from "../general/optionsMenu";
import CertificateImg from "../static/images/certificate.svg";
import { onSearch } from "../utilities/search";
const ApiButton = React.lazy(() => import("container/ApiButton"));

const CertificatesList = ({ items }) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  useEffect(() => {
    setFilteredData(onSearch(items, search));
  }, [search, items]);

  const certificates = filteredData.map((el) => {
    const options = ["edit", "deleteCertificate"];
    return (
      <Table.Row key={el.id}>
        <Table.Cell textAlign="left">
          <div className="name-wrapper">
            <img src={CertificateImg} width="35" alt="Certificate" />
            <Link to={`${el.id}`}>{el.name}</Link>
          </div>
        </Table.Cell>
        <Table.Cell textAlign="right">
          {(
            <OptionsMenu type="certificates" instance={el} options={options} />
          ) || ""}
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <section>
      <div className="tools">
        <Input
          icon="search"
          iconPosition="left"
          placeholder={t("searchField")}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <div className="create-route-buttons">
          <React.Suspense fallback={null}>
            <ApiButton
              element="certificates"
              user={user}
              locationUrl={baseUrls[user.location]}
            />
          </React.Suspense>
          <Link to={"create"}>
            <Button primary size="medium">
              {t("createCertificate")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="table-container">
        <Table basic="very" className="bordered">
          {filteredData.length > 0 && <Table.Body>{certificates}</Table.Body>}
        </Table>
      </div>
    </section>
  );
};

CertificatesList.propTypes = {
  items: PropTypes.array,
};

export default CertificatesList;
