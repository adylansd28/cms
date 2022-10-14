import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  selectedContact: Contact;

  constructor(private contService: ContactService) { }

  ngOnInit(): void {
    this.contService.contactSelectedEvent.subscribe(contact => {
      this.selectedContact = contact;
    });
  }

}
