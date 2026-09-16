from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    # Run the app locally in debug mode
    app.run(debug=True, port=5555)