import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  currentDocument: Document;
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document("1", "docName1", "docDescription1", "docUrl1", "docChildren1"),
    new Document("2", "docName2", "docDescription2", "docUrl2", "docChildren2"),
    new Document("3", "docName3", "docDescription3", "docUrl3", "docChildren3"),
    new Document("4", "docName4", "docDescription4", "docUrl4", "docChildren4"),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
