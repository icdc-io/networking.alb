import { Button } from "container/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import type { Ref } from "react";
import React, { useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

type CancelChangesModalProps = {
	onConfirm: () => void;
};

export type CancelModalRef = {
	handleClick: () => void;
};

function CancelChangesModal(
	{ onConfirm }: CancelChangesModalProps,
	ref: Ref<CancelModalRef>,
) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		handleClick: () => {
			setOpen(true);
		},
	}));

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen: boolean) => {
				setOpen(isOpen);
			}}
		>
			<DialogContent
				aria-describedby={undefined}
				className="cancelChangesModal networking_balancer_modal"
			>
				<DialogHeader>
					<DialogTitle>{t("cancelChanges")}</DialogTitle>
				</DialogHeader>
				<p>{t("sureCancelChanges")}</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary" size="lg" type="button">
							{t("dismiss")}
						</Button>
					</DialogClose>
					<Button onClick={onConfirm}>{t("yesCancel")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default React.forwardRef(CancelChangesModal);
