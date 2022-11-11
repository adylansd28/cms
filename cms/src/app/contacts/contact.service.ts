import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact [] =[];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  getContact(index: number){
    return this.contacts[index]
  }

  getMaxId(): number {

    let maxId = 0

    this.contacts.forEach( contact => {

      let currentId = +contact.id;

      if (currentId > maxId) {
        maxId = currentId
      }

    })
    
    return maxId

  }

  addContact(newContact: Contact) {

    if (newContact == undefined || newContact == null) { return };

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);

  }
  
  updateContact(originalContact: Contact, newContact: Contact) {

    if (originalContact == undefined || originalContact == null || newContact == undefined || newContact == null) { return };

    let pos = this.contacts.indexOf(originalContact);

    if (pos < 0) { return };

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  deleteContact(contact: Contact) {

    if (contact == undefined || contact == null) { return };

    let pos = this.contacts.indexOf(contact);

    if (pos < 0) { return };

    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice()
    this.contactListChangedEvent.next(contactsListClone);
  }

}