import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[]{
    return this.documents.slice();
  }

  getContact(id:string): Document{

    for (let doc = 0; doc < this.documents.length; doc++){

      if (this.documents[doc].id == id){
        return this.documents[doc]
      }

    }

    return null
  }
}
