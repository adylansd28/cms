import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: Message[] = [];
  messageSelectedEvent = new EventEmitter<Message>();
  messageChangedEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
    this.http.get<Message[]>("https://cms-wdd430-ds-default-rtdb.firebaseio.com/messages.json")
    .subscribe(
      // success method
      (messages: Message[] ) => {

        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        messages.sort((a,b) =>{
          if (a < b) {
            return -1
          } else if (a > b) {
            return 1
          } else {
            return 0
          }
        });
        this.messageListChangedEvent.next(messages.slice());
      },
      // error method
      (error: any) => {
        console.log(error)
      } 
    );
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

  addMessage(newMessage: Message){
    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.messageChangedEvent.emit(this.messages.slice());
    this.storeDocuments();
  }

  getMaxId(): number {

    let maxId = 0

    this.messages.forEach( message => {

      let currentId = +message.id;

      if (currentId > maxId) {
        maxId = currentId
      }

    })
    
    return maxId

  }

  storeDocuments() {
    
    let mess = JSON.stringify(this.messages);
    this.http.put("https://cms-wdd430-ds-default-rtdb.firebaseio.com/messages.json", mess, 
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(
      () => {
        this.messageListChangedEvent.next(this.messages.slice())
      }
    );

  }
  
}