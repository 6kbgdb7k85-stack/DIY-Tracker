import os
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

app = Flask(__name__, static_folder="../client/dist", static_url_path="")

database_url = os.environ.get("DATABASE_URL")
jwt_key = os.environ.get('JWT_SECRET_KEY')

if database_url:
    # Render's PostgreSQL URLs often start with 'postgres://'
    # SQLAlchemy 1.4+ requires 'postgresql://' instead
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    # Fallback to local SQLite for development
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///local_development.db"
if jwt_key:
    app.config['JWT_SECRET_KEY']=jwt_key
else:
    app.config["JWT_SECRET_KEY"] = "dev-key"
    
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

api = Api(app)
