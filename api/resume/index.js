const User = require('../users/userModel')
const { Configuration, OpenAIApi } = require("openai");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../../errors')

const configuration = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const ChatGPTFunction = async (text) => {

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: text,
		temperature: 0.6,
		max_tokens: 250,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 1,
	});
	return response.data.choices[0].text;
};


const createResume = async (req, res) => {
  try{
  //console.log(req.body)
  
	const prompt1 = 
  `I am writing a resume as a undergraduate student looking for a first time internship, my details are 
  \n name: ${req.body.fullName} 
  \n course: ${req.body.currentCourse} 
  \n I am studying in: ${req.body.currentInstitute}. 
  \n I am familiar with these technologies: ${req.body.currentTechnologies}. 
  Can you write a 100 words description for the top of the resume(first person writing)?`;

  const prompt2 = 
  `I am writing a resume as a student looking for a internship, my details are
  \n name: ${req.body.fullName} 
  \n course: ${req.body.currentCourse}. 
  \n these are my projects: ${req.body.projectinfo}. 
  Can you make a description of the project/s listed as points for a resume? 
  in the format like <span style="font-weight:bold;">{projects listed}</span> -{" "}{project description in seperate quotations} 
  make sure to include the span and dont add tag at the start and dont add backward slash n'`;
	const summary = await ChatGPTFunction(prompt1);
	const projectdescription = await ChatGPTFunction(prompt2);

  const chatgptData = { summary, projectdescription };

  console.log(chatgptData)
  res.status(StatusCodes.CREATED).json({ chatgptData });
}
catch (error) {
  console.log(error);
  res.status(500).json({ message: 'Server error' });
}
}

module.exports = {
  createResume
}