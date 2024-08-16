from flask import Flask, request, jsonify, render_template
import requests
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env file
load_dotenv()

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    raise ValueError(
        "OpenAI API key is missing. Please set the API key in the .env file.")

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.form  # Use form data from the frontend
    url = data.get('url')

    try:
        # Step 1: Fetch the content of the URL
        response = requests.get(url)
        response.raise_for_status()  # Check for request errors
        soup = BeautifulSoup(response.content, 'html.parser')

        # Step 2: Extract relevant text content
        paragraphs = [p.get_text() for p in soup.find_all('p')]
        content = "\n\n".join(paragraphs)

        # Step 3: Send the extracted text to OpenAI API for flashcard generation
        messages = [
            {"role": "system", "content": "You are a flashcard creator."},
            {"role": "user", "content": f"""Take the following text and create exactly 10 flashcards from it.
Both the front and back of the flashcards should be one sentence long the. the front should be a question and the back should be the answer.
Return the flashcards in the following JSON format:
{{
  "flashcards": [
    {{
      "front": "Front of the card",
      "back": "Back of the card"
    }}
  ]
}}:\n\n{content}"""}
        ]

        openai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1500,
            n=1,
            stop=None,
            temperature=0.5
        )

        # Step 4: Process the generated flashcards
        raw_flashcards = openai_response.choices[0].message['content'].strip()

        # Convert the raw response to a JSON object
        flashcards_json = json.loads(raw_flashcards)

        # Debugging: Print the flashcards data to ensure correctness
        print(f"Generated Flashcards: {flashcards_json}")

        return render_template('flashcards.html', flashcards=flashcards_json)

    except json.JSONDecodeError as e:
        return jsonify({"error": f"Error decoding JSON from OpenAI response: {str(e)}"}), 500
    except requests.RequestException as e:
        return jsonify({"error": f"Error fetching the URL: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
