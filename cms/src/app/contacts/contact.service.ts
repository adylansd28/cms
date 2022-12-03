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
    this.http.get<{message:string; documents: Contact[]}>("http://localhost:3000/contacts")
    .subscribe(
      // success method
      (reqcontacts: any) => {
        this.contacts = reqcontacts.documents;
        this.maxContactId = this.getMaxId();
        //sort the list of documents
        this.contacts.sort((a, b) => {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          }
          return 0;
        });
        //emit the next document list change event
        this.contactListChangedEvent.next(this.contacts.slice());
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

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }
  
  
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    /*newContact._id = originalContact._id;*/

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
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

  
  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
    );
  }

  sortAndSend() {
    this.maxContactId = this.getMaxId();
    this.contacts.sort((a: Contact, b: Contact) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    });
    const clonedDocuments = this.contacts.slice()
    this.contactListChangedEvent.next(clonedDocuments);
}

}