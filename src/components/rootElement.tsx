import { certificatesPath, webRoutesPath } from "@/constants/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "container/Tabs";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const RootElement: React.FC<PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation();
	const location = useLocation();
	const isRootBalancerPath =
		location.pathname.split("/").filter((route) => route).length < 3;
	const navigate = useNavigate();
	const defaultRoute = location.pathname.split("/")[3];

	const menuItems = [
		{
			name: t("webRoutes"),
			path: webRoutesPath(),
		},
		{
			name: t("certificates"),
			path: certificatesPath(),
		},
	];

	if (
		isRootBalancerPath ||
		!menuItems.find((item) => item.path === defaultRoute)
	)
		return <Navigate to={webRoutesPath()} replace />;

	return (
		<Tabs
			value={defaultRoute}
			onValueChange={(value: string) => navigate(value)}
			className="h-full overflow-hidden"
		>
			<TabsList>
				{menuItems.map((item) => (
					<TabsTrigger key={item.path} value={item.path}>
						{item.name}
					</TabsTrigger>
				))}
			</TabsList>
			{menuItems
				.filter((item) => item.path === defaultRoute)
				.map((item) => (
					<TabsContent key={item.path} value={item.path} className="h-full">
						<div className="flex flex-col relative border-[var(--border-color)] bg-white p-4 border m-0 h-full">
							{children}
						</div>
					</TabsContent>
				))}
		</Tabs>
	);
};

export default RootElement;
