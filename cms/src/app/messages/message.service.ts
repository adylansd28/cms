import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(){
    return this.messages.slice();
  }

  getMessage(id: string){

    for (let mes = 0; mes < this.messages.length; mes++){

      if (this.messages[mes].id === id){
        return this.messages[mes]
      }

    }

    return null

  }

  addMessage(message: Message){
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }
  
}
