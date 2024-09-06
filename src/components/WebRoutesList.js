import { returnBaseUrl } from "container/ReturnBaseUrl";
import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Popup, Table } from "semantic-ui-react";
import OptionsMenu from "../general/optionsMenu";
import WebRoute from "../static/images/webroutes.svg";
import { onSearch, returnServiceInfo } from "../utilities/search";

const WebRoutesList = ({ items, search }) => {
  const { t } = useTranslation();

  const [filteredData, setFilteredData] = useState([]);
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const [sortUp, setSortUp] = useState(true);

  useEffect(() => {
    setFilteredData(
      [...items].sort((a, b) =>
        sortUp
          ? a.cloud_gateway_id - b.cloud_gateway_id
          : b.cloud_gateway_id - a.cloud_gateway_id,
      ),
    );
  }, [sortUp]);

  useEffect(() => {
    setFilteredData(onSearch(items, search));
  }, [search, items]);

  const headerRow = [
    { title: t("name") },
    { title: t("hostname") },
    { title: t("targetPort") },
    { title: t("tlsTermination") },
    { title: t("service") },
    { title: t("balancer") },
    { title: "" },
  ];

  const computeUrl = `https://compute.${returnBaseUrl(baseUrls, user.location)}/ui/service/services/`;

  const routes = filteredData.map((el) => {
    const options = ["edit", "deleteWebRoutes"];
    const service = (route) =>
      route.services
        .map((e, i) => (
          <div key={i}>
            <a
              href={`${computeUrl}${e.ext_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {returnServiceInfo(e)}
            </a>
            <br />
          </div>
        ))
        .slice();

    return (
      <Table.Row key={el.id}>
        <Table.Cell width={3}>
          <div className="name-wrapper">
            <img src={WebRoute} width="35" alt="WebRoute" />
            <Link to={`${el.id}`}>{el.name}</Link>
          </div>
        </Table.Cell>

        <Table.Cell width={2}>{el.hostname}</Table.Cell>
        <Table.Cell width={1}>
          {el.target_port ? el.target_port : "—"}
        </Table.Cell>
        <Table.Cell width={2}>
          {el.tls_termination ? el.tls_termination : "—"}
        </Table.Cell>
        <Table.Cell width={4}>
          <div className="td-wrapper">
            {el.services.length > 0 ? (
              <a
                href={`${computeUrl}${el.services[0]?.ext_id}`}
                target="_blank"
                rel="noreferrer"
              >
                {`${el.services[0].name} (${el.services[0].ext_id})`}
              </a>
            ) : (
              "—"
            )}
            {el.services.length > 0 && (
              <Popup
                className="popup-window"
                on="click"
                pinned
                position="top right"
                inverted
                trigger={<div className="popup-dots">...</div>}
              >
                {service(el)}
              </Popup>
            )}
          </div>
        </Table.Cell>
        <Table.Cell width={4}>
          {el.cloud_gateway
            ? `${el.cloud_gateway.cloudgw_instance} (${el.cloud_gateway.name})`
            : "—"}
        </Table.Cell>
        <Table.Cell width={1} textAlign="right">
          {(true && (
            <OptionsMenu type="webRoutes" instance={el} options={options} />
          )) ||
            ""}
        </Table.Cell>
      </Table.Row>
    );
  });

  const headers = headerRow.map((el, index) => {
    if (index === 5) {
      return (
        <Table.HeaderCell
          className={`sort-col ${sortUp ? "ascending" : "descending"}`}
          key={index}
          onClick={() => setSortUp((prev) => !prev)}
        >
          {el.title}
        </Table.HeaderCell>
      );
    }
    return <Table.HeaderCell key={index}>{el.title}</Table.HeaderCell>;
  });

  return (
    <section>
      <div className="table-container">
        <Table basic="very">
          <Table.Header>
            <Table.Row>{headers}</Table.Row>
          </Table.Header>
          {filteredData.length > 0 && <Table.Body>{routes}</Table.Body>}
        </Table>
      </div>
    </section>
  );
};

WebRoutesList.propTypes = {
  items: PropTypes.any,
  search: PropTypes.string,
};

export default WebRoutesList;
