import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Admonition = ({ message }: { message: string }) => {
	const { t } = useTranslation();

	return (
		<div className="admonition">
			<CircleAlert size={15} />
			<span>{t(message)}</span>
		</div>
	);
};
