import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  contacts : Contact[] = []

  constructor(private contService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contService.getContacts();
  }

  onContactSelected(contact: Contact){
    this.contService.contactSelectedEvent.emit(contact);
  }

}
