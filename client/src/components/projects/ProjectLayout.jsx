import { Outlet, useOutletContext } from "react-router";

const ProjectLayout = () => {
  const appContext = useOutletContext()
  return <Outlet context={appContext} />;
};

export default ProjectLayout;
