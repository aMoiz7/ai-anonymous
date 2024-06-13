import { Message } from './../models/User';

export interface Apires{
    success : boolean,
    message : string,
    isAcceptingMessage ?: boolean ,
    Message ?: Array<Message>
}