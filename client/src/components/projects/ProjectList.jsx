import React, { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import { PROJECT_TABLE_COLUMNS } from "./projectConstants";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import TableHead from "@mui/material/TableHead";
import TableWrapper from "../../common/components/Table/TableWrapper";
import { useNavigate } from "react-router";

function ProjectList() {
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    total: 0,
    totalPages: 0,
  });
  const [projects, setProjects] = useState([]);
  const {
    response: projectsResponse,
    loading: projectsLoading,
    runFetch: getProjects,
  } = useFetch("projects");

  const{
	response: updateProjectResponse,
	loading: updateProjectLoading,
	runFetch: updateProject,
  }=useFetch("projects/:projectId","PATCH",false)

  const navigate = useNavigate();

  useEffect(()=>{
	if(projectsResponse){
		setProjects(projectsResponse.items)
		setPagination({page:projectsResponse.page,perPage:projectsResponse.per_page,total:projectsResponse.total,totalPages:projectsResponse.total_pages})
	}
  },[projectsResponse])

  useEffect(()=>{
	if(updateProjectResponse){
		setProjects(prevState=>(prevState.map(project=>{
			if(project.id==updateProjectResponse.id){
				return updateProjectResponse
			}else{
				return project
			}
		})))
	}
  },[updateProjectResponse])

  function handlePagination(){
	console.log(pagination)
  }

  function handleRowClick(id){
	navigate(id.toString())
  }

  function handleChange(projectId,id,value){
	updateProject({
		urlParams:[{key:':projectId',value:projectId}],
		[id]:value
	})
  }

  return (
    <section>
      <h2>Projects</h2>
      <TableWrapper
	  	cols={PROJECT_TABLE_COLUMNS}
		data={projects}
		loading={projectsLoading}
		pagination={pagination}
		expandedTable={{title:'Tasks',cols:PROJECT_TABLE_COLUMNS,dataCol:'tasks'}}
		onPage={handlePagination}
		onRowClick={handleRowClick}
		onChange={handleChange}
	  />
    </section>
  );
}

export default ProjectList;
