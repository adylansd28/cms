import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[]{
    return this.documents.slice();
  }

  getDocument(index: number){
    return this.documents[index]
  }
  
  getMaxId(): number {

    let maxId = 0

    this.documents.forEach( document => {

      let currentId = +document.id;

      if (currentId > maxId) {
        maxId = currentId
      }

    })
    
    return maxId

  }
  
  addDocument(newDocument: Document) {

    if (newDocument == undefined || newDocument == null) { return };

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);

  }

  
  updateDocument(originalDocument: Document, newDocument: Document) {

    if (originalDocument == undefined || originalDocument == null || newDocument == undefined || newDocument == null) { return };

    let pos = this.documents.indexOf(originalDocument);

    if (pos < 0) { return };

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  
  deleteDocument(document: Document) {

    if (document == undefined || document == null) { return };

    let pos = this.documents.indexOf(document);

    if (pos < 0) { return };

    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone);
  }
}
