import { certificatesPath, webRoutesPath } from "@/constants/routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "container/Tabs";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const RootElement = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const isRootBalancerPath =
		location.pathname.split("/").filter((route) => route).length < 3;
	const navigate = useNavigate();
	const defaultRoute = location.pathname.split("/")[3];

	if (isRootBalancerPath) return <Navigate to={webRoutesPath()} replace />;

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
			{menuItems.map((item) => (
				<TabsContent key={item.path} value={item.path} className="h-full">
					<div className="flex flex-col relative border-[var(--border-color)] bg-white p-4 border m-0 h-full">
						<Outlet />
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
};

export default RootElement;
