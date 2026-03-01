from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_code():
    data = request.get_json()
    code = data.get('code', '').strip()
    language = data.get('language', 'python')

    if not code:
        return jsonify({'explanation': 'Please provide some code!'}), 400

    explanation = ""
    if language == 'python':
        if "print(" in code:
            explanation += "✅ Your print statement looks good.\n"
        else:
            explanation += "⚠️ You may need a print statement.\n"
        if "def" in code:
            explanation += "✅ You defined a function!\n"
    elif language == 'c':
        if "printf" in code:
            explanation += "✅ printf looks correct.\n"
        else:
            explanation += "⚠️ Remember to include printf.\n"
        if "int main" not in code:
            explanation += "⚠️ C programs need an 'int main()' function.\n"
    else:
        explanation += "⚠️ Language not supported."

    explanation += "\n💡 Tip: Test small pieces of code first!"
    return jsonify({'explanation': explanation})

if __name__ == "__main__":
    app.run(debug=True)