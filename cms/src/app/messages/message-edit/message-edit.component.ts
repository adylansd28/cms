import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {

  
  currentSender: string = "Dylan"
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText', {static: true}) msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private mesService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage(){
    let sub = this.subject.nativeElement.value;
    let msg = this.msgText.nativeElement.value
    let newMessage =  new Message("136049", sub, msg, this.currentSender);
    // this.addMessageEvent.emit(newMessage);
    this.mesService.addMessage(newMessage);
  }

  onClear(){
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }

}
