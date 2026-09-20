# DIY-Tracker
    A Web platform to plan and track DIY projects

# Features
- Create Account
- Create Projects
- Create Tasks associated with accounts
- Create entries for Tools and Parts required for various tasks
    - manage lists of parts and tools required to complete tasks
        - these lists are also available at the project level to show a complete list of parts and tools needed for the project
- Create and manage list of tools you already own or otherwise need for an upcoming project
- Mark projects and tasks complete as you finish them

# Local Setup
- clone repo
- in client directory run the following
    - npm install
    - npm run dev
- in server directory run the following
    - pipenv install
    - pipenv shell
    - flask db upgrade
    - python3 seed.py
    - python3 app.py
- you can now use the app from npm localhost
    - seeded user "demo" has a single project with 1 task and a few tools based on real data
        - other users will have data that is formatted like real data but is otherwise nonsensical