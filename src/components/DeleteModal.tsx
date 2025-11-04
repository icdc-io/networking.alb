import { Button } from "container/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import React, { type Ref, useImperativeHandle, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

type DeleteModalProps<T> = {
	onSubmit: (instance: T) => Promise<unknown>;
	title: string;
	description: string;
};

type Instance = {
	name: string;
} & Record<string, unknown>;

export type ModalRef<T> = {
	handleClick: (instance: T) => void;
};

function DeleteModal<T extends Instance>(
	{ onSubmit, title, description = "" }: DeleteModalProps<T>,
	ref: Ref<ModalRef<T>>,
) {
	const { t } = useTranslation();
	const [isVisible, setIsVisible] = useState(false);
	const [instance, setInstance] = useState<T | null>(null);

	useImperativeHandle(ref, () => ({
		handleClick: (instance) => {
			setInstance(instance);
			setIsVisible(true);
		},
	}));

	if (!instance) return null;

	const onSubmitHandler = () =>
		onSubmit(instance).then(() => setIsVisible(false));

	const getDescription = () => {
		if (!instance) return t(description);

		return <Trans i18nKey={description} values={{ name: instance.name }} />;
	};

	return (
		<Dialog
			open={isVisible}
			onOpenChange={(isOpen: boolean) => {
				setIsVisible(isOpen);
			}}
		>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>{t(title)}</DialogTitle>
				</DialogHeader>
				<p>{getDescription()}</p>
				<p>{t("cannotBeUndone")}</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost" type="button">
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button type="button" variant="warning" onClick={onSubmitHandler}>
						{t("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default React.forwardRef(DeleteModal);
