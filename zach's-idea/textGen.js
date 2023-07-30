const openaiApiKey = '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'; // Replace with your actual API key
let disableAI = false

async function generateText(previousMessages) {
    if(disableAI) return;
    console.log(previousMessages)
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: previousMessages,
                temperature: 0.8,
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
