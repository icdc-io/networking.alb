import { Button } from "container/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ButtonBack = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const onClick = () => navigate("..");

	return (
		<Button variant="back" size="lg" onClick={onClick}>
			{t("back")}
		</Button>
	);
};

export default ButtonBack;
