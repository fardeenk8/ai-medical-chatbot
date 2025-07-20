# app/services/vision.py

import base64
from groq import Groq

MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct"

# Step 1: Encode image
def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

# Step 2: Send to multimodal LLM
def analyze_image(prompt: str, image_path: str) -> str:
    encoded = encode_image(image_path)
    client = Groq()

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{encoded}",
                    },
                },
            ],
        }
    ]

    chat_completion = client.chat.completions.create(
        messages=messages,
        model=MODEL_NAME
    )

    return chat_completion.choices[0].message.content

