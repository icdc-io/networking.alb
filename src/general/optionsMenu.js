/* eslint-disable react/display-name */
import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import { useTranslation } from "react-i18next";

const OptionsMenu = ({ type, instance, options }) => {
  const { t } = useTranslation();

  const actions = {
    certificates: {
      edit: (certificate, key) => (
        <Link
          key={key}
          to={`${certificate.id}/edit`}
          role="option"
          className="item"
        >
          <Dropdown.Item text={t("edit")} />
        </Link>
      ),
      deleteCertificate: (certificate, key) => (
        <DeleteModal key={key} type={type} instance={certificate} />
      ),
    },
    webRoutes: {
      edit: (webRoute, key) => (
        <Link
          key={key}
          to={`${webRoute.id}/edit`}
          role="option"
          className="item"
        >
          <Dropdown.Item text={t("edit")} onClick={() => {}} />
        </Link>
      ),
      deleteWebRoutes: (webRoute, key) => (
        <DeleteModal key={key} type={type} instance={webRoute} />
      ),
    },
  };

  return (
    <Dropdown
      direction="left"
      icon="ellipsis vertical"
      className="users-list__actions_dot"
    >
      <Dropdown.Menu>
        {options.map((option, key) => actions[type][option](instance, key))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

OptionsMenu.propTypes = {
  instance: PropTypes.object,
  type: PropTypes.string,
  options: PropTypes.array,
  onClickAction: PropTypes.func,
};

export default OptionsMenu;
