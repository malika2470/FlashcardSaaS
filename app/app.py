import json
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
import requests
from bs4 import BeautifulSoup
import openai

# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

openai.api_key = (
    "OPEN_API")

if openai.api_key is None:
    raise ValueError(
        "OpenAI API key not found. Please check your .env.local file.")

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate-flashcards')
def generate_flashcards():
    url = request.args.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        # Fetch the content of the URL
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract relevant text content
        paragraphs = [p.get_text() for p in soup.find_all('p')]
        content = "\n\n".join(paragraphs)

        # Generate flashcards using OpenAI API
        messages = [
            {"role": "system", "content": "You are a flashcard creator."},
            {"role": "user", "content": f"""Take the following text and create exactly 10 flashcards from it.
            Both the front and back of the flashcards should be one sentence long. The front should be a question, and the back should be the answer.
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

        raw_flashcards = openai_response.choices[0].message['content'].strip()
        flashcards_json = json.loads(raw_flashcards)

        print("Generated Flashcards:", flashcards_json)

        return render_template('flashcards.html', flashcards=flashcards_json)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
