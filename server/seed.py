from app import app
from models import db, User, Project, Task, Part, Tool, TaskTools
from sqlalchemy import inspect

import random as r

from faker import Faker

fake = Faker()

with app.app_context():

    existing_tables = set(inspect(db.engine).get_table_names())

    if "user" in existing_tables:
        User.query.delete()
    if "project" in existing_tables:
        Project.query.delete()
    if "task" in existing_tables:
        Task.query.delete()
    if "part" in existing_tables:
        Part.query.delete()
    if "tool" in existing_tables:
        Tool.query.delete()
    if "task_tools" in existing_tables:
        TaskTools.query.delete()

    demo_user = User(username="demo")
    demo_user.password_hash = demo_user.username + "pass"

    demo_project = Project(
        name="1339 restoration",
        description="fixes for DeLorean 1339",
        user=demo_user,
        completed=False,
    )

    demo_task = Task(
        name="Replace Seals",
        description="Replace weather strips",
        project=demo_project,
        completed=False,
    )
    demo_project.tasks.append(demo_task)

    demo_part = Part(
        name="Weather Strip Kit",
        amount_required=1,
        amount_owned=0,
        source="DeLorean Midwest",
        cost=200,
        user=demo_user,
    )
    demo_user.parts.append(demo_part)
    demo_task.parts.append(demo_part)

    demo_tools = [
        Tool(name="Wrench 10mm", owned=True, user=demo_user, cost=0),
        Tool(name="Wrench 13mm", owned=True, user=demo_user, cost=0),
        Tool(name="Rivet Gun", owned=False, user=demo_user, cost=70),
    ]

    db.session.add(demo_user)
    db.session.add(demo_project)
    db.session.add(demo_task)
    db.session.add(demo_part)
    db.session.add_all(demo_tools)

    if app.config.get("SQLALCHEMY_DATABASE_URI") == "sqlite:///local_development.db":
        fake_users = []
        fake_projects = []
        fake_tasks = []
        fake_parts = []
        fake_tools = []

        fake_names = [fake.unique.first_name() for _ in range(9)]

        for i in range(9):
            user = User(username=fake_names[i])
            user.password_hash = user.username + "pass"
            fake_users.append(user)

        for i in range(19):
            project = Project(
                name=fake.sentence(),
                description=fake.paragraph(),
                completed=fake.pybool(),
            )
            project.user = r.choice(fake_users)
            fake_projects.append(project)

        for i in range(29):
            task = Task(
                name=fake.sentence(),
                description=fake.sentence(),
                completed=fake.pybool(),
            )
            task.project = r.choice(fake_projects)
            fake_tasks.append(task)

        for i in range(29):
            part = Part(
                name=fake.word(),
                source=fake.company(),
                amount_required=fake.pyint(min_value=0),
                amount_owned=fake.pyint(min_value=0),
                cost=fake.pyfloat(min_value=0.0),
            )
            assigned_task = r.choice(fake_tasks)
            part.task = assigned_task
            part.user = part.task.project.user
            fake_parts.append(part)

        for i in range(19):
            tool = Tool(
                name=fake.word(), owned=fake.pybool(), cost=fake.pyfloat(min_value=0.0)
            )
            tool.user = r.choice(fake_users)
            user_tasks = []
            for project in tool.user.projects:
                user_tasks.extend(project.tasks)
            if len(user_tasks) > 0:
                for n in range(r.randint(1, 5)):
                    tool_task = r.choice(user_tasks)
                    if tool_task not in tool.tasks:
                        tool.tasks.append(tool_task)
            fake_tools.append(tool)

            db.session.add_all(fake_users)
            db.session.add_all(fake_projects)
            db.session.add_all(fake_tasks)
            db.session.add_all(fake_parts)
            db.session.add_all(fake_tools)

    db.session.commit()

    db.session.commit()
