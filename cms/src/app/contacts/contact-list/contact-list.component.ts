import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  currentContact = Contact;
  private subscription: Subscription;

  contacts : Contact[] = []

  constructor(private contService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contService.getContacts();
    this.contService.contactChangedEvent.subscribe(
      (conts: Contact[]) => {
        this.contacts = conts;
      }
    );

    this.subscription = this.contService.contactListChangedEvent.subscribe(
      (contactList: Contact[]) => {
        this.contacts = contactList;
      }
    );
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

}
