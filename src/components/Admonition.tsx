import type { TOptions } from "i18next";
import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Admonition = ({
	message,
	options,
}: {
	message: string;
	options?: TOptions;
}) => {
	const { t } = useTranslation();

	return (
		<div className="admonition">
			<CircleAlert size={15} />
			<span>{t(message, options)}</span>
		</div>
	);
};
