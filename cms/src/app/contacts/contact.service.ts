import {Injectable, EventEmitter} from '@angular/core';
import {Contact} from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact [] =[];

  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[]{
    return this.contacts.slice();
  }

  getContact(id: string): Contact{

    for (let cont = 0; cont < this.contacts.length; cont++) {
      if (this.contacts[cont].id === id) {
        return this.contacts[cont]
      }
    }

    return null

  }
}