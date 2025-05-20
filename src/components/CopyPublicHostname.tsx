import CopyButton from "container/CopyButton";
import { useAppSelector } from "container/ReduxActions";
import { getPublicHostname } from "../utilities/getPublicHostname";

const CopyPublicHostname = () => {
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);

	const publicHostname = getPublicHostname(user, baseUrls);

	return (
		<span>
			{publicHostname}
			&nbsp;
			<CopyButton content={publicHostname} />
		</span>
	);
};

export default CopyPublicHostname;
