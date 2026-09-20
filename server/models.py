from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields

from config import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    projects = db.relationship(
        "Project", back_populates="user", cascade="all, delete-orphan"
    )
    parts = db.relationship("Part", back_populates="user", cascade="all, delete-orphan")
    tools = db.relationship("Tool", back_populates="user", cascade="all, delete-orphan")

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hash may not be viewed")

    @password_hash.setter
    def password_hash(self, password):
        p_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = p_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    def __repr__(self):
        return f"<User {self.username}, {self.id}>"


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String(required=True)
    projects = fields.List(
        fields.Nested(lambda: ProjectSchema(exclude=("user", "tasks")))
    )
    parts = fields.List(fields.Nested(lambda: PartSchema(exclude=("user", "task"))))
    tools = fields.List(fields.Nested(lambda: ToolSchema(exclude=("user", "tasks"))))


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    completed = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="projects")
    tasks = db.relationship(
        "Task", back_populates="project", cascade="all, delete-orphan"
    )


class ProjectSchema(Schema):
    id = fields.Int()
    name = fields.String(required=True)
    description = fields.String()
    completed = fields.Bool()

    user = fields.Nested(
        lambda: UserSchema(exclude=("projects", "parts", "tools")), required=True
    )
    tasks = fields.List(fields.Nested(lambda: TaskSchema(exclude=("project",))))


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    time = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    completed = db.Column(db.Boolean)

    project = db.relationship("Project", back_populates="tasks")
    parts = db.relationship("Part", back_populates="task", cascade="all, delete-orphan")
    tools = db.relationship("Tool", secondary="task_tools", back_populates="tasks")


class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    time = fields.String(allow_none=True)
    completed = fields.Bool(allow_none=True)

    project = fields.Nested(
        lambda: ProjectSchema(exclude=("tasks", "user")), required=True
    )
    parts = fields.List(fields.Nested(lambda: PartSchema(exclude=("task", "user"))))
    tools = fields.List(fields.Nested(lambda: ToolSchema(exclude=("user", "tasks"))))


class Part(db.Model):
    __tablename__ = "parts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    cost = db.Column(db.Float)
    amount_required = db.Column(db.Integer)
    amount_owned = db.Column(db.Integer)
    source = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))

    user = db.relationship("User", back_populates="parts")
    task = db.relationship("Task", back_populates="parts")


class PartSchema(Schema):
    id = fields.Int()
    name = fields.String(required=True)
    cost = fields.Float()
    amount_required = fields.Int()
    amount_owned = fields.Int()
    source = fields.String()

    task = fields.Nested(lambda: TaskSchema(exclude=("parts", "tools")), required=True)
    user = fields.Nested(
        lambda: UserSchema(exclude=("parts", "projects", "tools")), required=True
    )


class TaskTools(db.Model):
    __tablename__ = "task_tools"

    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey("tools.id"), primary_key=True)


class Tool(db.Model):
    __tablename__ = "tools"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    owned = db.Column(db.Boolean)
    cost = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="tools")
    tasks = db.relationship("Task", secondary="task_tools", back_populates="tools")


class ToolSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String(required=True)
    owned = fields.Bool()
    cost = fields.Float()

    user = fields.Nested(
        lambda: UserSchema(exclude=("tools", "projects", "parts")), required=True
    )
    tasks = fields.List(
        fields.Nested(lambda: TaskSchema(exclude=("tools", "project", "parts")))
    )
