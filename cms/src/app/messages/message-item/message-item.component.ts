import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Contact } from 'src/app/contacts/contact.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  
  messageSender: string;
  @Input() message: Message;

  constructor(private contService: ContactService) { }

  ngOnInit(): void {
    const contact: Contact = this.contService.getContact(this.message.sender);
    this.messageSender = contact.name;
  }

}
