import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ButtonBack from "../general/buttonBack";
import CreateEditForm from "./CreateEditForm";

const CreateEditRoute = () => {
	const { t } = useTranslation();

	const { id } = useParams();

	return (
		<div className="flex flex-col gap-4">
			<div>
				<ButtonBack />
			</div>
			<div>
				<h2>{id ? t("editRoute") : t("createRoute")}</h2>
				<CreateEditForm />
			</div>
		</div>
	);
};

export default CreateEditRoute;
