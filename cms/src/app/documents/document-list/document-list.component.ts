import { Component, OnInit, OnDestroy,Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {

  currentDocument: Document;
  documents: Document[] = [];
  private subscription: Subscription;

  constructor(private docService: DocumentService) {}

  ngOnInit(): void {
    this.documents = this.docService.getDocuments();
    this.docService.documentChangedEvent.subscribe(
      (docs: Document[]) => {
        this.documents = docs;
      }
    );

    this.subscription = this.docService.documentListChangedEvent.subscribe(
      (documentList: Document[]) => {
        this.documents = documentList;
      }
    );

  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

}
