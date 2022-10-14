import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  currentDocument: Document;

  constructor(private docService: DocumentService) { }

  ngOnInit(): void {
    this.docService.documentSelectedEvent.subscribe(document => {
      this.currentDocument = document
    });
  }

  getCurrentDocument(newDoc: Document){
    this.currentDocument = newDoc;
  }
}
