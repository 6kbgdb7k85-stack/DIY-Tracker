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

# Browser Usage
    https://diy-tracker-6llk.onrender.com/

## Home/Login/Signup
- create account with username and password or login to existing account
    - make note of these credentials as there is no password reset at this time

## Dashboard /projects
- add projects and tools via their respective tables on the dashboard screen /projects
    - projects and tools can also be edited in these tables
- click on a row to navigate to the corresponding project/table

## Project View /projects/:projectId
- view lists of all parts and tools required for the project
- view list of tasks
    - task can be edited in table
    - click a row to navigate to the corresponding task

## Task View /projects/:projectId/tasks/:taskId
- view lists of parts and tools required for the task
    - can be edited in respective tables

## Tool View /tools/:toolId
- view information about the tool
- view list of tasks the tool is used for