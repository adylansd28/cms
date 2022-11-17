import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService { 
  
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) 
    {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    this.http.get<Document[]>("https://cms-wdd430-ds-default-rtdb.firebaseio.com/documents.json")
    .subscribe(
      // success method
      (documents: Document[] ) => {

        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        documents.sort((a,b) =>{
          if (a < b) {
            return -1
          } else if (a > b) {
            return 1
          } else {
            return 0
          }
        });
        this.documentListChangedEvent.next(documents.slice());
      },
      // error method
      (error: any) => {
        console.log(error)
      } 
    );
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
    this.storeDocuments();

  }

  
  updateDocument(originalDocument: Document, newDocument: Document) {

    if (originalDocument == undefined || originalDocument == null || newDocument == undefined || newDocument == null) { return };

    let pos = this.documents.indexOf(originalDocument);

    if (pos < 0) { return };

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
  }

  
  deleteDocument(document: Document) {

    if (document == undefined || document == null) { return };

    let pos = this.documents.indexOf(document);

    if (pos < 0) { return };

    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice()
    this.storeDocuments();
  }

  storeDocuments() {
    let docs = JSON.stringify(this.documents);
    this.http.put("https://cms-wdd430-ds-default-rtdb.firebaseio.com/documents.json", docs, 
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice())
      }
    );


  }
}
