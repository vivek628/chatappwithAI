
import  { GoogleGenerativeAI }from "@google/generative-ai" ;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_APIKEY);
const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash" ,
    systemInstruction:` you are a expert in mern and you have 10 years of experience in development you always write 
    code modulor and break the code possoble way and follow the best practice in your code you always handle error `
});

export const genrateResult=async(prompt)=>{
    const result=await model.generateContent(prompt)
    return result.response.text()

}

