from app import app
from models import db, User, Project, Task, Part, Tool

with app.app_context():

    User.query.delete()
    Project.query.delete()
    Task.query.delete()
    Part.query.delete()

    demo_user = User(username='demo')
    demo_user.password_hash=demo_user.username+'password'

    demo_project=Project(name="1339 restoration",description="fixes for DeLorean 1339",user=demo_user)

    demo_task=Task(name="Replace Seals",description="Replace weather strips",project=demo_project)
    demo_project.tasks.append(demo_task)

    demo_part=Part(name="Weather Strip Kit",amount_required=1,amount_owned=0,source="DeLorean Midwest", cost=200, user=demo_user)
    demo_user.parts.append(demo_part)
    demo_task.parts.append(demo_part)

    demo_tools=[
        Tool(name='Wrench 10mm',owned=True, user=demo_user),
        Tool(name='Wrench 13mm', owned=True, user=demo_user),
        Tool(name="Rivet Gun",owned=False,cost=70, user=demo_user)
    ]

    db.session.add(demo_user)
    db.session.add(demo_project)
    db.session.add(demo_task)
    db.session.add(demo_part)
    db.session.add_all(demo_tools)
    db.session.commit()
