let disableAI = false;

async function generateText(previousMessages) {
    if (!disableAI) {
        try {
            console.log("getting completion");

            // Convert the messages array to a JSON string
            const jsonMessages = JSON.stringify(previousMessages);

            // Send the completion request to the server using fetch
            const response = await fetch(`/generate-text?previousMessages=${encodeURIComponent(jsonMessages)}`);

            // Parse the response as JSON
            const data = await response.json();

            console.log(data);
            const generatedText = data.choices[0].message.content;
            console.log(generatedText);
            return generatedText;
        } catch (error) {
            console.error(error);
        }
    }
}
