import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  currentDocument: Document;

  documents: Document[] = [];

  constructor(private docService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.docService.getDocuments();
    this.docService.documentChangedEvent.subscribe(
      (docs: Document[]) => {
        this.documents = docs;
      }
    );
  }

}
