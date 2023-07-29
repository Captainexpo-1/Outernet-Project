const openaiApiKey = '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'; // Replace with your actual API key

let randomEmotionChoices = [
    "drunk", 
    "sad",
    "happy",
    "angry",
    "horny",
    "depressed",
    "lonely",
    "excited",
    "bored",
    "tired",
    "hungry",
    "thirsty",
    "high",
    "stoned",
    "sleepy",
    "annoyed",
    "confused",
    "stressed",
]
let randomEmotion = randomEmotionChoices[Math.floor(Math.random() * randomEmotionChoices.length)];

console.log(randomEmotion)


async function generateText(previousMessages) {
    console.log(previousMessages)
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {"role": "system", "content": `You am very ${randomEmotion}, and you will act like it. Don't say you are an AI`}, 
                ].concat(previousMessages),
                temperature: 1,
                max_tokens: 50,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
            }
        );
        console.log(response.data);
        const generatedText = response.data.choices[0].message.content;
        lastMessages.push(response.data.choices[0].message)
        console.log(generatedText);
    // Handle the generated text as needed (e.g., display it on the web page)
    return generatedText;
    } catch (error) {
        console.error('Error:', error);
    }
}