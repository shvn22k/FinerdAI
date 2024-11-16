import requests
import google.generativeai as genai
import os
from langchain_google_genai import ChatGoogleGenerativeAI
import re
from pydub import AudioSegment
from pydub.playback import play
from dotenv import load_dotenv
import tempfile
import io
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


model = ChatGoogleGenerativeAI(model="gemini-pro",google_api_key=GOOGLE_API_KEY,
                             temperature=0.7,convert_system_message_to_human=True)


def generate_podcast_script(blog):
    prompt = f"""
    Generate a podcast script based on the following blog post:
    {blog}
    The podcast named Finerd should have two hosts, Chris and Jessica, engaging in a natural conversation.  Include intros, outros, and transitions between topics.  Make the script sound like a casual and informative discussion, suitable for a podcast audience interested in finance.  Focus on the key takeaways from the blog post.
    TRY TO ELABORATE THE KEY TOPICS AND MAKE THEM LONGER USING YOUR OWN EXISTING KNOWLEDGE FROM THE WEB.
    """
    podcast_script = model.predict(prompt)
    return podcast_script

def generate_txt_script(podcast_script):
    text = re.sub(r'#|\*|\[|\]|\(|\)', '', podcast_script)
    text = re.sub(r'\n{3,}', '\n\n', text)  # Reduce multiple newlines
    return io.StringIO(text)  # Return in-memory text stream

def jessica(dialogue):
    CHUNK_SIZE = 1024
    temp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)

    url = "https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": "sk_616545331afd82d008bac3c93743af4f48a5d883825ce901"
    }
    data = {
        "text": dialogue,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.8, "similarity_boost": 1}
    }
    response = requests.post(url, json=data, headers=headers)
    with open(temp_file.name, 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)
    return temp_file

def chris(dialogue):
    CHUNK_SIZE = 1024
    temp_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)

    url = "https://api.elevenlabs.io/v1/text-to-speech/iP95p4xoKVk53GoZ742B"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": "sk_616545331afd82d008bac3c93743af4f48a5d883825ce901"
    }
    data = {
        "text": dialogue,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.8, "similarity_boost": 1}
    }
    response = requests.post(url, json=data, headers=headers)
    with open(temp_file.name, 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)
    return temp_file

def generate_podcast(blog_id, Markdown_blog : str, store_to):
    combined_audio = AudioSegment.empty()
    podcast_stream = generate_txt_script(Markdown_blog)

    for line in podcast_stream:
        line = line.strip()
        if line.startswith("Chris:"):
            dialogue = line[6:]  # Extract dialogue after "Chris:"
            audio_file = chris(dialogue)
            combined_audio += AudioSegment.from_mp3(audio_file.name)
            audio_file.close()  # Close and delete the temporary file
            os.unlink(audio_file.name)
        elif line.startswith("Jessica:"):
            dialogue = line[9:]  # Extract dialogue after "Jessica:"
            audio_file = jessica(dialogue)
            combined_audio += AudioSegment.from_mp3(audio_file.name)
            audio_file.close()  # Close and delete the temporary file
            os.unlink(audio_file.name)
    smb_path = store_to + f"{blog_id}.mp3"
    combined_audio.export(smb_path, format="mp3")