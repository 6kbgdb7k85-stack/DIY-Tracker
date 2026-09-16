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
    parts = db.relationship(
        "Part", back_populates="user", cascade="all, delete-orphan"
    )

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
    username = fields.String()
    projects = fields.List(fields.Nested(lambda: ProjectSchema(exclude=("user",))))
    parts = fields.List(fields.Nested(lambda: PartSchema(exclude=("user",))))


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="projects")
    tasks = db.relationship(
        "Task", back_populates="project", cascade="all, delete-orphan"
    )


class ProjectSchema(Schema):
    id = fields.Int()
    name = fields.String()
    description = fields.String()

    user = fields.Nested(lambda: UserSchema(exclude=("projects",)))
    tasks = fields.List(fields.Nested(lambda: TaskSchema(exclude=("project",))))


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    time = db.Column(db.String)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))

    project = db.relationship("Project", back_populates="tasks")
    parts = db.relationship("Part", back_populates="task", cascade="all, delete-orphan")


class TaskSchema(Schema):
    id = fields.Int()
    name = fields.String()
    description = fields.String()
    time = fields.String()

    project = fields.Nested(lambda: ProjectSchema(exclude=("tasks",)))
    parts = fields.List(fields.Nested(lambda: PartSchema(exclude=("task",))))


class Part(db.Model):
    __tablename__ = "parts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    part_type = db.Column(db.String)
    cost = db.Column(db.Float)
    amount_required = db.Column(db.Integer)
    amount_owned = db.Column(db.Integer)
    source = db.Column(db.String)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship('User',back_populates="parts")
    task = db.relationship('Task',back_populates="parts")


class PartSchema(Schema):
    id = fields.Int()
    name = fields.String()
    part_type = fields.String()
    cost = fields.Float()
    amount_required = fields.Int()
    amount_owned = fields.Int()
    source = fields.String()

    task = fields.Nested(lambda: TaskSchema(exclude=("parts",)))
    user = fields.Nested(lambda: UserSchema(exclude=("tasks",)))
