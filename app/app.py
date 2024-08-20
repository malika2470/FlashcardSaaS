import json
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import openai
from flask_cors import CORS


# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

openai.api_key = ('enter your own api key here')   

if openai.api_key is None:
    raise ValueError(
        "OpenAI API key not found. Please check your .env.local file.")

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "Welcome to the Flashcard Generator API"


@app.route('/generate-flashcards')
def generate_flashcards():
    url = request.args.get('url')
    print(f"Received URL: {url}")

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

        print(f"Extracted Content: {content[:500]}...")

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

        raw_flashcards = openai_response.choices[0]['message']['content'].strip(
        )

        try:
            flashcards_json = json.loads(raw_flashcards)
            print("Generated Flashcards:", flashcards_json)
            return jsonify(flashcards_json)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            print(f"Raw response: {raw_flashcards}")
            return jsonify({"error": "Invalid JSON received from OpenAI API"}), 500

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching the URL: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("Starting the Flask server...")
    app.run(port=5000, debug=True)