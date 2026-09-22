from flask import request, make_response, jsonify, redirect, url_for
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity,
    create_access_token,
)
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from marshmallow import EXCLUDE

from config import app, db, api
from models import *


@app.before_request
def check_logged_in():
    open_routes = ["login", "signup"]

    if request.endpoint not in open_routes and not verify_jwt_in_request():
        return make_response({"error": "401 Unauthorized"}, 401)


@app.before_request
def check_resource_ownership():
    # endpoints holding user owned resources
    user_owned_endpoints = [
        "project",
        "project_task",
        "tool",
        "project_parts",
        "project_tools",
        "project_tasks",
        "part",
    ]
    # resource classes to use based on endpoint
    user_owned_resources = {
        "project": Project,
        "task": Task,
        "part": Part,
        "tool": Tool,
        "tasks": Project,
    }

    if request.endpoint in user_owned_endpoints:
        user_id = get_jwt_identity()
        user = User.query.filter(User.id == user_id).first()
        # endpoint of format parent_child can be used to get auth based on the parent resource
        resource_name = request.endpoint.split("_")[0]
        # route id params must be formatted as {resource}_id
        entity_id = request.view_args.get(f"{resource_name}_id")
        resource = user_owned_resources.get(resource_name, None)
        # make sure route params match existing resources
        print(entity_id)
        print(resource)
        if not resource or not entity_id:
            return make_response({"error": "400 Bad Request"}, 400)
        entity = resource.query.filter(resource.id == entity_id).first()
        # ensure an entity was found
        if not entity:
            return make_response(
                {"error": f"404 {request.endpoint.capitalize()} {entity_id} Not Found"},
                404,
            )
        # ensure user owns the entity
        if entity.user != user:
            return make_response({"error": "403 Forbidden"}, 403)


class Login(Resource):
    def post(self):
        username = request.get_json().get("username")
        password = request.get_json().get("password")
        if not username or not password:
            return make_response({"error": "400 Bad Request"}, 400)
        user = User.query.filter(User.username == username).first()
        if user and user.authenticate(password):
            auth_token = create_access_token(identity=str(user.id))
            return make_response(
                jsonify(token=auth_token, user=UserSchema().dump(user)), 200
            )
        else:
            return make_response({"error": "401 Invalid Login"}, 401)


class Signup(Resource):
    def post(self):
        username = request.get_json().get("username")
        password = request.get_json().get("password")
        if not username or not password:
            return make_response({"error": "400 Bad Request"})
        user = User(username=username)
        user.password_hash = password
        try:
            db.session.add(user)
            db.session.commit()
            auth_token = create_access_token(identity=str(user.id))
            return make_response(
                jsonify(token=auth_token, user=UserSchema().dump(user)), 201
            )
        except IntegrityError:
            return make_response({"error": "422 Unprocessable Entity"}, 422)


class CheckToken(Resource):
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.filter(User.id == user_id).first()
        return make_response(UserSchema().dump(user), 200)


class ProjectList(Resource):
    def get(self):
        user_id = get_jwt_identity()
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        pagination = Project.query.filter(Project.user_id == user_id).paginate(
            page=page, per_page=per_page, error_out=False
        )
        projects = pagination.items
        return make_response(
            {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "total_pages": pagination.pages,
                "items": [ProjectSchema().dump(project) for project in projects],
            },
            200,
        )

    def post(self):
        user_id = get_jwt_identity()
        user = User.query.filter(User.id == user_id).first()
        request_body = request.get_json()

        project = Project(**request_body)
        project.user = user
        try:
            db.session.add(project)
            db.session.commit()
            return make_response(ProjectSchema().dump(project), 201)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"}, 400)


class ProjectView(Resource):
    def get(self, project_id):
        project = Project.query.filter(Project.id == project_id).first()
        return make_response(ProjectSchema().dump(project), 200)

    def patch(self, project_id):
        project = Project.query.filter(Project.id == project_id).first()
        request_body = request.get_json()
        validated_data = ProjectSchema(exclude=("user", "tasks")).load(
            request_body, unknown=EXCLUDE, partial=True
        )
        for k, v in validated_data.items():
            if k != "id" and hasattr(project, k):
                setattr(project, k, v)
        try:
            db.session.commit()
            return make_response(ProjectSchema().dump(project), 200)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"}, 400)

    def delete(self, project_id):
        project = Project.query.filter(Project.id == project_id).first()
        try:
            db.session.delete(project)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": "500 Server Error"})


class TaskList(Resource):
    def get(self, project_id):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        try:
            pagination = Task.query.filter(Task.project_id == project_id).paginate(
                page=page, per_page=per_page, error_out=False
            )
            tasks = pagination.items
            return make_response(
                {
                    "page": page,
                    "per_page": per_page,
                    "total": pagination.total,
                    "total_pages": pagination.pages,
                    "items": [TaskSchema().dump(task) for task in tasks],
                },
                200,
            )
        except Exception as e:
            return make_response({"error": "500 Server Error"})

    def post(self, project_id):
        project = Project.query.filter(Project.id == project_id).first()
        if not project:
            return make_response({"error": f"404 Project {project_id} Not Found"}, 404)
        request_body = request.get_json()
        task = Task(**request_body)
        task.project = project
        try:
            db.session.add(task)
            db.session.commit()
            return make_response(TaskSchema().dump(task), 201)
        except IntegrityError:
            return ({"error": "400 Bad Request"}, 400)


class TaskView(Resource):
    def get(self, project_id, task_id):
        task = Task.query.filter(Task.id == task_id).first()
        return make_response(TaskSchema(exclude=("project",)).dump(task), 200)

    def patch(self, project_id, task_id):
        task = Task.query.filter(Task.id == task_id).first()
        request_body = request.get_json()
        validatedData = TaskSchema(exclude=("project", "parts")).load(
            request_body, unknown=EXCLUDE, partial=True
        )
        for k, v in validatedData.items():
            if hasattr(task, k):
                setattr(task, k, v)
        try:
            db.session.commit()
            return make_response(TaskSchema().dump(task), 200)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"})

    def delete(self, project_id, task_id):
        task = Task.query.filter(Task.id == task_id).first()
        try:
            db.session.delete(task)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": "500 Server error"})


class PartList(Resource):
    def get(self, project_id, task_id=None):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        if task_id:
            pagination = Part.query.filter(Part.task_id == task_id).paginate(
                page=page, per_page=per_page, error_out=False
            )
        else:
            pagination = (
                Part.query.join(Part.task)
                .filter(Task.project_id == project_id)
                .paginate(page=page, per_page=per_page, error_out=False)
            )
        parts = pagination.items
        return make_response(
            {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "total_pages": pagination.pages,
                "items": [PartSchema().dump(part) for part in parts],
            },
            200,
        )

    def post(self, project_id, task_id):
        request_body = request.get_json()
        user_id = get_jwt_identity()
        task = Task.query.filter(Task.id == task_id).first()
        part = Part(**request_body)
        part.task = task
        part.user_id = user_id
        try:
            db.session.add(part)
            db.session.commit()
            return make_response(PartSchema().dump(part), 201)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"})


class PartView(Resource):
    def get(self, part_id):
        part = Part.query.filter(Part.id == part_id).first()
        return make_response(PartSchema().dump(part), 200)

    def patch(self, part_id):
        part = Part.query.filter(Part.id == part_id).first()
        request_body = request.get_json()
        validatedData = PartSchema().load(request_body, partial=True, unknown=EXCLUDE)
        for k, v in validatedData.items():
            if k != "id" and hasattr(part, k):
                setattr(part, k, v)
        try:
            db.session.commit()
            return make_response(PartSchema().dump(part), 200)
        except IntegrityError as e:
            return make_response({"error": "400 Bad Request"})

    def delete(self, part_id):
        part = Part.query.filter(Part.id == part_id).first()
        try:
            db.session.delete(part)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": "500 server error"})


class ToolList(Resource):
    def get(self, project_id=None, task_id=None):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        if task_id:
            pagination = (
                Tool.query.join(Tool.tasks)
                .filter(Task.id == task_id)
                .paginate(page=page, per_page=per_page, error_out=False)
            )
        elif project_id:
            pagination = (
                Tool.query.join(Tool.tasks)
                .filter(Task.project_id == project_id)
                .distinct()
                .paginate(page=page, per_page=per_page, error_out=False)
            )
        else:
            user_id = get_jwt_identity()
            pagination = Tool.query.filter(Tool.user_id == user_id).paginate(
                page=page, per_page=per_page, error_out=False
            )
        tools = pagination.items
        return make_response(
            {
                "page": page,
                "per_page": per_page,
                "total": pagination.total,
                "total_pages": pagination.pages,
                "items": [ToolSchema().dump(tool) for tool in tools],
            },
            200,
        )

    def post(self, project_id=None, task_id=None):
        user_id = get_jwt_identity()
        request_body = request.get_json()
        tool = Tool(**request_body)
        tool.user_id = user_id
        try:
            db.session.add(tool)
            db.session.commit()
            return make_response(ToolSchema().dump(tool), 201)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"})


class ToolView(Resource):
    def get(self, tool_id):
        tool = Tool.query.filter(Tool.id == tool_id).first()
        return make_response(ToolSchema().dump(tool), 200)

    def patch(self, tool_id):
        tool = Tool.query.filter(Tool.id == tool_id).first()
        request_body = request.get_json()
        validatedData = ToolSchema(exclude=("user",)).load(
            request_body, partial=True, unknown=EXCLUDE
        )
        for k, v in validatedData.items():
            if hasattr(tool, k):
                setattr(tool, k, v)
        try:

            db.session.commit()
            return make_response(ToolSchema().dump(tool), 200)
        except IntegrityError:
            return make_response({"error": "400 Bad Request"}, 400)

    def delete(self, tool_id):
        tool = Tool.query.filter(Tool.id == tool_id).first()
        try:
            db.session.delete(tool)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": "500 Server Error"})


api.add_resource(Login, "/login", endpoint="login")
api.add_resource(Signup, "/signup", endpoint="signup")
api.add_resource(CheckToken, "/me", endpoint="me")
api.add_resource(ProjectList, "/projects", endpoint="projects")
api.add_resource(ProjectView, "/projects/<int:project_id>", endpoint="project")
api.add_resource(TaskList, "/projects/<int:project_id>/tasks", endpoint="project_tasks")
api.add_resource(
    TaskView, "/projects/<int:project_id>/tasks/<int:task_id>", endpoint="project_task"
)
api.add_resource(
    PartList,
    "/projects/<int:project_id>/tasks/<int:task_id>/parts",
    "/projects/<int:project_id>/parts",
    endpoint="project_parts",
)
api.add_resource(
    PartView,
    "/parts/<int:part_id>",
    endpoint="part",
)
api.add_resource(
    ToolList,
    "/tools",
    endpoint="tools",
)
api.add_resource(
    ToolList,
    "/projects/<int:project_id>/tasks/<int:task_id>/tools",
    "/projects/<int:project_id>/tools",
    endpoint="project_tools",
)
api.add_resource(
    ToolView,
    "/tools/<int:tool_id>",
    endpoint="tool",
)

if __name__ == "__main__":
    # Run the app locally in debug mode
    app.run(debug=True, port=5555)
