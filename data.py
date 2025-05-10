import json
from flask import Flask, request, jsonify

app = Flask(__name__)

DATA_FILE = "score_data.json"

def read_high_score():
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            return data.get("high_score", 0)
    except FileNotFoundError:
        return 0

def write_high_score(score):
    with open(DATA_FILE, "w") as f:
        json.dump({"high_score": score}, f)

@app.route("/get_high_score", methods=["GET"])
def get_high_score():
    high_score = read_high_score()
    return jsonify({"high_score": high_score})

@app.route("/update_high_score", methods=["POST"])
def update_high_score():
    data = request.json
    new_score = data.get("score", 0)
    current_high = read_high_score()

    if new_score > current_high:
        write_high_score(new_score)
        return jsonify({"message": "High score updated!", "high_score": new_score})
    else:
        return jsonify({"message": "Score not high enough.", "high_score": current_high})

if __name__ == "__main__":
    app.run(debug=True)
