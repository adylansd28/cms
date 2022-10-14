import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [];

  constructor(private mesService: MessageService) { }

  ngOnInit(): void {
    this.messages = this.mesService.getMessages();
    this.mesService.messageChangedEvent.subscribe(message => this.messages = message);
  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }

}
