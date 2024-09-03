import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Grid, Header } from "semantic-ui-react";
// import { detailsPath, webRoutesPath } from "../constants/routes";
import ButtonBack from "../general/buttonBack";
import CreateEditForm from "./CreateEditForm";

const CreateEditRoute = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  return (
    <>
      <ButtonBack back={t("back")} path={".."} />
      <Grid>
        <Grid.Row className="routeHeader">
          <Header as="h2" className="create-route__title">
            {id ? t("editRoute") : t("createRoute")}
          </Header>
        </Grid.Row>
      </Grid>
      <CreateEditForm />
    </>
  );
};

export default CreateEditRoute;
