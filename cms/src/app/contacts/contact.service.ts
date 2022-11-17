import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact [] =[];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
    this.http.get<Contact[]>("https://cms-wdd430-ds-default-rtdb.firebaseio.com/contacts.json")
    .subscribe(
      // success method
      (contacts: Contact[] ) => {

        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        contacts.sort((a,b) =>{
          if (a < b) {
            return -1
          } else if (a > b) {
            return 1
          } else {
            return 0
          }
        });
        this.contactListChangedEvent.next(contacts.slice());
      },
      // error method
      (error: any) => {
        console.log(error)
      } 
    );
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
    this.storeContacts();

  }
  
  updateContact(originalContact: Contact, newContact: Contact) {

    if (originalContact == undefined || originalContact == null || newContact == undefined || newContact == null) { return };

    let pos = this.contacts.indexOf(originalContact);

    if (pos < 0) { return };

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
  }

  deleteContact(contact: Contact) {

    if (contact == undefined || contact == null) { return };

    let pos = this.contacts.indexOf(contact);

    if (pos < 0) { return };

    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice()
    this.storeContacts();
  }

  storeContacts() {
    let conts = JSON.stringify(this.contacts);
    this.http.put("https://cms-wdd430-ds-default-rtdb.firebaseio.com/contacts.json", conts, 
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice())
      }
    );


  }

}