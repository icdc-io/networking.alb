import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Header, Modal } from "semantic-ui-react";
import { certificatesPath, webRoutesPath } from "../constants/routes";

const CancelChangesModal = ({ open, setOpen, type }) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="tiny"
      className="cancelChangesModal networking_balancer_modal"
    >
      <Modal.Content>
        <div className="close-btn" onClick={() => setOpen(false)} />
        <Header as="h2" style={{ margin: "auto 0 23px 0" }}>
          {t("cancelChanges")}
        </Header>
        <p>{t("sureCancelChanges")}</p>
      </Modal.Content>

      <Modal.Actions style={{ background: "none" }}>
        <Button
          onClick={() => setOpen(false)}
          style={{ marginRight: "10px" }}
          content={t("dismiss")}
        />
        <Link to={type !== "forRoute" ? certificatesPath() : webRoutesPath()}>
          <Button primary content={t("yesCancel")} />
        </Link>
      </Modal.Actions>
    </Modal>
  );
};

CancelChangesModal.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.func,
  type: PropTypes.string,
};

export default CancelChangesModal;
