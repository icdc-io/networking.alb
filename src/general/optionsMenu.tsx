import { Button } from "container/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "container/DropdownMenu";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

type OptionsMenu<T> = {
	options: {
		text: string;
		action: (instance: T) => (e: React.MouseEvent<HTMLDivElement>) => void;
		color?: "red";
	}[];
	instance: T;
};

const OptionsMenu = <T,>({ options, instance }: OptionsMenu<T>) => {
	const { t } = useTranslation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options.map((option) => (
					<DropdownMenuItem
						key={option.text}
						onSelect={option.action(instance)}
						color={option.color}
					>
						{t(option.text)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default OptionsMenu;
