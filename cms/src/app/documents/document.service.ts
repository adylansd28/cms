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
    this.maxDocumentId = this.getMaxId();
    this.http.get<{message: string; documents: Document[]}>('http://localhost:3000/documents').subscribe(
      (reqdocuments: any) => {
        this.documents = reqdocuments.documents;
        this.maxDocumentId = this.getMaxId();
        //sort the list of documents
        this.documents.sort((a, b) => {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          }
          return 0;
        });
        //emit the next document list change event
        this.documentListChangedEvent.next(this.documents.slice());
      },
      // error method
      (error: any) => {
        //print the error to the console
        console.error(error);
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
  
  
  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    /*newDocument._id = originalDocument._id;*/

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response) => {
          this.documents[pos] = newDocument;
          this.storeDocuments();
        }
      );
  }
  
  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
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

  sortAndSend() {
    this.maxDocumentId = this.getMaxId();
    this.documents.sort((a: Document, b: Document) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    });
    const clonedDocuments = this.documents.slice()
    this.documentListChangedEvent.next(clonedDocuments);
}
}
