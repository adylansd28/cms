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
    this.http.get<Message[]>("http://localhost:3000/messages")
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

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Document is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Message }>('http://localhost:3000/documents',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.document);
          this.sortAndSend();
        }
      );
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

  sortAndSend() {
    this.maxMessageId = this.getMaxId();
    this.messages.sort((a: Message, b: Message) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    });
    const clonedDocuments = this.messages.slice()
    this.messageListChangedEvent.next(clonedDocuments);
}
  
}