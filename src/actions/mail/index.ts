import { sendMail } from "./queries"

export const mailSender=async (email:string, subject:string, text:any)=>{
    const emailSent=await sendMail(email, subject, text)
    if(!emailSent){
        return { error: "Error while sending email" };
    }
    return emailSent
}