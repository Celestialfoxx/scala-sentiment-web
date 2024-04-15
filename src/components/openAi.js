import axios from 'axios';

/**
 * 使用OpenAI GPT模型解析文本，包括基本信息和问题
 * @param {string} text 需要解析的文本
 * @param {string} question 提出的问题
 * @returns {Promise<string>} 模型返回的解析文本
 */

const fetchText = async (text) => {
  const prompt = `Here is the sentiment data on the topic "airline" for the few days. Each data point represents the sentiment score for one hour, where the scale ranges from -1 (very negative) to 1 (very positive). The data I'm giving you is multiple key-value pairs, where key represents the number of hours to the present time and value is the analysed sentiment score.
data: ${text}
  Please analyze this data and provide me with a summary of the sentiment trend these days. Identify any key patterns or shifts in sentiment throughout the day and conclude with an overall sentiment trend for the day based on the given scores.`;
  //console.log(process.env.REACT_APP_API_KEY)
  try {
    
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: "gpt-3.5-turbo-instruct", 
        prompt: prompt,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      
      return response.data.choices[0].text.trim();
    }

    return "No response from model.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Failed to fetch response from API.";
  }
};

export default fetchText;
