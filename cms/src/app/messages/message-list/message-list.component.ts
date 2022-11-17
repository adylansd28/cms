import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [];
  private subscription: Subscription;

  constructor(private mesService: MessageService) { }

  ngOnInit(): void {/*
    this.messages = this.mesService.getMessages();
    this.mesService.messageChangedEvent.subscribe(message => this.messages = message);*/

    this.messages = this.mesService.getMessages();
    this.mesService.messageChangedEvent.subscribe(
      (mess: Message[]) => {
        this.messages = mess;
      }
    );

    this.subscription = this.mesService.messageListChangedEvent.subscribe(
      (messageList: Message[]) => {
        this.messages = messageList;
      }
    );
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

  onAddMessage(message: Message){
    this.mesService.addMessage(message);
  }

}