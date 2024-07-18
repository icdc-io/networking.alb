import React from "react";
import { useParams } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";
import { detailsPath, webRoutesPath } from "../constants/routes";
import ButtonBack from "../general/buttonBack";
import CreateEditForm from "./CreateEditForm";
import { useTranslation } from "react-i18next";

const CreateEditRoute = () => {
  const { t } = useTranslation();

  const { menuGroup, id } = useParams();

  return (
    <>
      <ButtonBack
        back={t("back")}
        path={id ? detailsPath(menuGroup, id) : webRoutesPath(menuGroup)}
      />
      <Grid>
        <Grid.Row className="routeHeader">
          <Header as="h2">{id ? t("editRoute") : t("createRoute")}</Header>
        </Grid.Row>
      </Grid>
      <CreateEditForm />
    </>
  );
};

export default CreateEditRoute;
