import PropTypes from "prop-types";
import React, { useState, useCallback } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Header, Icon, Modal } from "semantic-ui-react";
import { deleteCertificate, deleteWebRoute } from "../AppActions";
import { certificatesPath, webRoutesPath } from "../constants/routes";

const DeleteModal = ({ type, instance, icon, button }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.host.user);

  const dispatch = useDispatch();

  const types = {
    certificates: {
      item: "delete",
      header: "deleteCertificateHead",
      content: ["deleteCertificate"],
      textOptions: { name: `<b>${instance.name}</b>` },
      deleteAction: useCallback(() => {
        dispatch(deleteCertificate(instance.id));
        button && navigate(certificatesPath());
      }, [dispatch, instance.id, button, navigate]),
    },
    webRoutes: {
      item: "delete",
      header: "deleteRoute",
      content: ["deleteWebRoute"],
      textOptions: { name: `<b>${instance.name}</b>` },
      deleteAction: useCallback(() => {
        dispatch(deleteWebRoute(instance.id));
        button && navigate.push(webRoutesPath());
      }, [dispatch, instance.id, button, navigate]),
    },
  };
  const deleteButtonIsAvailable =
    types[type].content[0] === "deleteWebRoute" ||
    types[type].content[0] === "deleteCertificate";

  const showModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const onConfirm = () => {
    closeModal();
    types[type].deleteAction(instance);
  };

  const modalText = (modalContent, textOptions) =>
    modalContent.map((text, index) => (
      <Modal.Description
        as="p"
        content={<DangerousHTML html={t(text, textOptions)} />}
        key={index}
      />
    ));

  const modalTextWithName = (modalContent) => (
    <Modal.Description as="p" content={t(modalContent[0], modalContent[1])} />
  );

  const hasAssignedVms =
    type === "networks" &&
    instance.assignedVms &&
    instance.assignedVms.length > 0;

  const buttonModal = button ? (
    <Button
      onClick={showModal}
      basic
      size="small"
      color="red"
      content={t(types[type].item)}
      className="delete-route-button"
      disabled={hasAssignedVms}
    />
  ) : icon ? (
    <Icon name="trash alternate outline" onClick={showModal} />
  ) : (
    <Dropdown.Item onClick={showModal} className="delete">
      {t(types[type].item)}
    </Dropdown.Item>
  );

  return (
    (user.role === "admin" || deleteButtonIsAvailable) && (
      <>
        {buttonModal}
        <Modal
          className="networking_balancer_modal"
          open={isVisible}
          size="mini"
          onClick={closeModal}
          closeIcon
        >
          <Header as="h3" content={t(types[type].header)} />
          <Modal.Content
            content={modalText(
              types[type].content,
              types[type].textOptions || {},
            )}
            style={{ padding: "0 21px" }}
          />
          {types[type].contentNamed && (
            <Modal.Content
              style={{ padding: "0 21px" }}
              content={modalTextWithName(types[type].contentNamed)}
            />
          )}
          <Modal.Content
            style={{ padding: "0 21px" }}
            content={t("cannotBeUndone")}
          />
          <Modal.Actions align="center">
            <Button onClick={closeModal} content={t("cancel")} />
            <Button
              color="red"
              type="submit"
              onClick={onConfirm}
              content={t(type === "networks" ? "delete" : "confirm")}
            />
          </Modal.Actions>
        </Modal>
      </>
    )
  );
};

DeleteModal.propTypes = {
  type: PropTypes.string,
  instance: PropTypes.object,
  button: PropTypes.bool,
  icon: PropTypes.bool,
};

export default DeleteModal;
